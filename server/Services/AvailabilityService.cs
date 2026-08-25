using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Salon.Api.Data;
using Salon.Api.Domain;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;

namespace Salon.Api.Services;

public sealed class AvailabilityService : IAvailabilityService
{
    private static readonly AppointmentStatus[] BlockingStatuses =
    {
        AppointmentStatus.Pending,
        AppointmentStatus.Confirmed,
        AppointmentStatus.CheckedIn,
        AppointmentStatus.InProgress
    };

    private readonly SalonDbContext _db;
    private readonly SalonOptions _options;
    private readonly TimeProvider _timeProvider;

    public AvailabilityService(
        SalonDbContext db,
        IOptions<SalonOptions> options,
        TimeProvider timeProvider)
    {
        _db = db;
        _options = options.Value;
        _timeProvider = timeProvider;
    }

    public async Task<IReadOnlyCollection<AvailabilitySlotDto>> GetSlotsAsync(
        Guid serviceId,
        DateOnly date,
        Guid? staffId,
        CancellationToken cancellationToken)
    {
        var serviceExists = await _db.Services
            .AsNoTracking()
            .AnyAsync(service => service.Id == serviceId && service.IsActive, cancellationToken);
        if (!serviceExists)
        {
            throw ApiException.NotFound("The selected service does not exist or is unavailable.", "service_not_found");
        }

        var zone = TimeZoneResolver.Resolve(_options);
        var localToday = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(_timeProvider.GetUtcNow().UtcDateTime, zone));
        if (date < localToday || date > localToday.AddDays(_options.MaximumBookingDaysAhead))
        {
            throw ApiException.BadRequest(
                $"Choose a date between {localToday:yyyy-MM-dd} and {localToday.AddDays(_options.MaximumBookingDaysAhead):yyyy-MM-dd}.",
                "date_out_of_range");
        }

        var rangeStartUtc = TimeZoneResolver.ToUtc(date, TimeOnly.MinValue, zone);
        var rangeEndUtc = TimeZoneResolver.ToUtc(date.AddDays(1), TimeOnly.MinValue, zone);

        var staff = await _db.StaffMembers
            .AsNoTracking()
            .Where(member => member.IsActive && (!staffId.HasValue || member.Id == staffId.Value))
            .Where(member => member.StaffServices.Any(offering => offering.ServiceId == serviceId))
            .Select(member => new
            {
                member.Id,
                member.DisplayName,
                Offering = member.StaffServices
                    .Where(offering => offering.ServiceId == serviceId)
                    .Select(offering => new
                    {
                        Duration = offering.CustomDurationMinutes ?? offering.Service.DurationMinutes,
                        Price = offering.CustomPrice ?? offering.Service.Price
                    })
                    .Single(),
                Hours = member.Availability
                    .Where(hours => hours.IsActive && hours.DayOfWeek == date.DayOfWeek)
                    .Select(hours => new { hours.StartTime, hours.EndTime })
                    .ToList(),
                TimeOff = member.TimeOff
                    .Where(timeOff => timeOff.StartsAtUtc < rangeEndUtc && timeOff.EndsAtUtc > rangeStartUtc)
                    .Select(timeOff => new { timeOff.StartsAtUtc, timeOff.EndsAtUtc })
                    .ToList()
            })
            .ToListAsync(cancellationToken);

        if (staffId.HasValue && staff.Count == 0)
        {
            throw ApiException.NotFound("That technician is not active or does not offer the selected service.", "staff_not_available_for_service");
        }

        var staffIds = staff.Select(member => member.Id).ToArray();
        var appointments = await _db.Appointments
            .AsNoTracking()
            .Where(appointment => staffIds.Contains(appointment.StaffId) &&
                                  BlockingStatuses.Contains(appointment.Status) &&
                                  appointment.StartsAtUtc < rangeEndUtc &&
                                  appointment.EndsAtUtc > rangeStartUtc)
            .Select(appointment => new { appointment.StaffId, appointment.StartsAtUtc, appointment.EndsAtUtc })
            .ToListAsync(cancellationToken);

        var globalTimeOff = await _db.StaffTimeOff
            .AsNoTracking()
            .Where(timeOff => timeOff.StaffId == null &&
                              timeOff.StartsAtUtc < rangeEndUtc &&
                              timeOff.EndsAtUtc > rangeStartUtc)
            .Select(timeOff => new { timeOff.StartsAtUtc, timeOff.EndsAtUtc })
            .ToListAsync(cancellationToken);

        var firstPermittedStart = _timeProvider.GetUtcNow().UtcDateTime.AddMinutes(_options.MinimumBookingLeadMinutes);
        var slots = new List<AvailabilitySlotDto>();

        foreach (var member in staff)
        {
            var bookings = appointments.Where(appointment => appointment.StaffId == member.Id).ToList();
            foreach (var hours in member.Hours)
            {
                var cursor = TimeZoneResolver.ToUtc(date, hours.StartTime, zone);
                var closesAt = TimeZoneResolver.ToUtc(date, hours.EndTime, zone);

                while (cursor.AddMinutes(member.Offering.Duration) <= closesAt)
                {
                    var endsAt = cursor.AddMinutes(member.Offering.Duration);
                    var blocked = cursor < firstPermittedStart ||
                                  bookings.Any(item => item.StartsAtUtc < endsAt && item.EndsAtUtc > cursor) ||
                                  member.TimeOff.Any(item => item.StartsAtUtc < endsAt && item.EndsAtUtc > cursor) ||
                                  globalTimeOff.Any(item => item.StartsAtUtc < endsAt && item.EndsAtUtc > cursor);

                    if (!blocked)
                    {
                        slots.Add(new AvailabilitySlotDto(
                            member.Id,
                            member.DisplayName,
                            DateTime.SpecifyKind(cursor, DateTimeKind.Utc),
                            DateTime.SpecifyKind(endsAt, DateTimeKind.Utc),
                            member.Offering.Price,
                            true));
                    }

                    cursor = cursor.AddMinutes(_options.SlotIntervalMinutes);
                }
            }
        }

        return slots
            .OrderBy(slot => slot.StartsAtUtc)
            .ThenBy(slot => slot.StaffName)
            .ToArray();
    }

    public async Task<bool> IsStaffAvailableAsync(
        Guid staffId,
        Guid serviceId,
        DateTime startsAtUtc,
        int durationMinutes,
        Guid? excludeAppointmentId,
        CancellationToken cancellationToken)
    {
        if (startsAtUtc.Kind != DateTimeKind.Utc)
        {
            return false;
        }

        var now = _timeProvider.GetUtcNow().UtcDateTime;
        if (startsAtUtc < now.AddMinutes(_options.MinimumBookingLeadMinutes))
        {
            return false;
        }

        var endsAtUtc = startsAtUtc.AddMinutes(durationMinutes);
        var zone = TimeZoneResolver.Resolve(_options);
        var localStart = TimeZoneInfo.ConvertTimeFromUtc(startsAtUtc, zone);
        var localEnd = TimeZoneInfo.ConvertTimeFromUtc(endsAtUtc, zone);
        if (localStart.Date != localEnd.Date)
        {
            return false;
        }

        var localDate = DateOnly.FromDateTime(localStart);
        var today = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(now, zone));
        if (localDate > today.AddDays(_options.MaximumBookingDaysAhead))
        {
            return false;
        }

        var localStartTime = TimeOnly.FromDateTime(localStart);
        var localEndTime = TimeOnly.FromDateTime(localEnd);
        var offersService = await _db.StaffServices
            .AsNoTracking()
            .AnyAsync(offering => offering.StaffId == staffId &&
                                  offering.ServiceId == serviceId &&
                                  offering.Staff.IsActive &&
                                  offering.Service.IsActive,
                cancellationToken);
        if (!offersService)
        {
            return false;
        }

        var insideWorkingHours = await _db.StaffAvailability
            .AsNoTracking()
            .AnyAsync(hours => hours.StaffId == staffId &&
                               hours.DayOfWeek == localDate.DayOfWeek &&
                               hours.IsActive &&
                               hours.StartTime <= localStartTime &&
                               hours.EndTime >= localEndTime,
                cancellationToken);
        if (!insideWorkingHours)
        {
            return false;
        }

        var isOnTimeOff = await _db.StaffTimeOff
            .AsNoTracking()
            .AnyAsync(timeOff => (timeOff.StaffId == null || timeOff.StaffId == staffId) &&
                                  timeOff.StartsAtUtc < endsAtUtc &&
                                  timeOff.EndsAtUtc > startsAtUtc,
                cancellationToken);
        if (isOnTimeOff)
        {
            return false;
        }

        var hasConflict = await _db.Appointments
            .AsNoTracking()
            .AnyAsync(appointment => appointment.StaffId == staffId &&
                                     (!excludeAppointmentId.HasValue || appointment.Id != excludeAppointmentId.Value) &&
                                     BlockingStatuses.Contains(appointment.Status) &&
                                     appointment.StartsAtUtc < endsAtUtc &&
                                     appointment.EndsAtUtc > startsAtUtc,
                cancellationToken);

        return !hasConflict;
    }
}
