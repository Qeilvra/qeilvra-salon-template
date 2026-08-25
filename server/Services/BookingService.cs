using System.Data;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Data;
using Salon.Api.Domain;
using Salon.Api.Domain.Entities;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;

namespace Salon.Api.Services;

public sealed class BookingService : IBookingService
{
    private readonly SalonDbContext _db;
    private readonly IAvailabilityService _availability;
    private readonly IPaymentGateway _payments;
    private readonly INotificationSender _notifications;
    private readonly TimeProvider _timeProvider;

    public BookingService(
        SalonDbContext db,
        IAvailabilityService availability,
        IPaymentGateway payments,
        INotificationSender notifications,
        TimeProvider timeProvider)
    {
        _db = db;
        _availability = availability;
        _payments = payments;
        _notifications = notifications;
        _timeProvider = timeProvider;
    }

    public async Task<BookingResponse> CreateAsync(
        CreateBookingRequest request,
        Guid? customerId,
        CancellationToken cancellationToken)
    {
        EnsureUtc(request.StartsAtUtc);

        var service = await _db.Services
            .Include(item => item.ServiceAddOns)
                .ThenInclude(item => item.AddOn)
            .Include(item => item.StaffServices)
                .ThenInclude(item => item.Staff)
            .SingleOrDefaultAsync(item => item.Id == request.ServiceId && item.IsActive, cancellationToken)
            ?? throw ApiException.NotFound("The selected service does not exist or is unavailable.", "service_not_found");

        var requestedAddOnIds = request.AddOnIds.Distinct().ToArray();
        var addOns = service.ServiceAddOns
            .Where(link => requestedAddOnIds.Contains(link.AddOnId) && link.AddOn.IsActive)
            .Select(link => link.AddOn)
            .ToArray();
        if (addOns.Length != requestedAddOnIds.Length)
        {
            throw ApiException.BadRequest("One or more add-ons are unavailable for the selected service.", "invalid_add_on");
        }

        var candidates = service.StaffServices
            .Where(offering => offering.Staff.IsActive &&
                               (!request.StaffId.HasValue || offering.StaffId == request.StaffId.Value))
            .OrderByDescending(offering => offering.Staff.IsFeatured)
            .ThenBy(offering => offering.Staff.DisplayName)
            .ToArray();
        if (candidates.Length == 0)
        {
            throw ApiException.NotFound("No active technician offers the selected service.", "technician_not_found");
        }

        StaffService? selectedOffering = null;
        foreach (var offering in candidates)
        {
            var duration = (offering.CustomDurationMinutes ?? service.DurationMinutes) + addOns.Sum(addOn => addOn.DurationMinutes);
            if (await _availability.IsStaffAvailableAsync(
                    offering.StaffId,
                    service.Id,
                    request.StartsAtUtc,
                    duration,
                    null,
                    cancellationToken))
            {
                selectedOffering = offering;
                break;
            }
        }

        if (selectedOffering is null)
        {
            throw ApiException.Conflict(
                "That appointment time is no longer available. Refresh availability and choose another time.",
                "slot_unavailable");
        }

        var basePrice = selectedOffering.CustomPrice ?? service.Price;
        var baseDuration = selectedOffering.CustomDurationMinutes ?? service.DurationMinutes;
        var subtotal = basePrice + addOns.Sum(addOn => addOn.Price);
        var coupon = await FindValidCouponAsync(request.CouponCode, subtotal, forServices: true, cancellationToken);
        var discount = CalculateDiscount(coupon, subtotal);
        var total = Math.Max(0, subtotal - discount);
        var deposit = Math.Min(service.DepositAmount, total);

        PaymentIntentResult? payment = null;
        if (request.PayDeposit && deposit > 0)
        {
            payment = await _payments.CreateIntentAsync(
                deposit,
                $"Deposit for {service.Name}",
                request.PaymentMethodId,
                new Dictionary<string, string>
                {
                    ["serviceId"] = service.Id.ToString(),
                    ["customerEmail"] = request.Customer.Email
                },
                cancellationToken);
        }

        await using var transaction = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);
        var durationMinutes = baseDuration + addOns.Sum(addOn => addOn.DurationMinutes);
        if (!await _availability.IsStaffAvailableAsync(
                selectedOffering.StaffId,
                service.Id,
                request.StartsAtUtc,
                durationMinutes,
                null,
                cancellationToken))
        {
            throw ApiException.Conflict(
                "That appointment time was just reserved by another guest. Please select a new time.",
                "slot_unavailable");
        }

        var item = new AppointmentItem
        {
            ServiceId = service.Id,
            ServiceName = service.Name,
            DurationMinutes = baseDuration,
            UnitPrice = basePrice,
            AddOns = addOns.Select(addOn => new AppointmentItemAddOn
            {
                AddOnId = addOn.Id,
                Name = addOn.Name,
                DurationMinutes = addOn.DurationMinutes,
                Price = addOn.Price
            }).ToList()
        };

        var appointment = new Appointment
        {
            Number = CreateReference("MN"),
            CustomerId = customerId,
            StaffId = selectedOffering.StaffId,
            CouponId = coupon?.Id,
            GuestFirstName = request.Customer.FirstName.Trim(),
            GuestLastName = request.Customer.LastName.Trim(),
            GuestEmail = request.Customer.Email.Trim().ToLowerInvariant(),
            GuestPhone = request.Customer.Phone.Trim(),
            StartsAtUtc = request.StartsAtUtc,
            EndsAtUtc = request.StartsAtUtc.AddMinutes(durationMinutes),
            Status = AppointmentStatus.Confirmed,
            PaymentStatus = payment?.Paid == true ? PaymentStatus.DepositPaid : PaymentStatus.Unpaid,
            Subtotal = subtotal,
            DiscountAmount = discount,
            DepositAmount = deposit,
            Total = total,
            Notes = request.Notes?.Trim(),
            StripePaymentIntentId = payment?.ExternalId,
            Items = new List<AppointmentItem> { item }
        };

        _db.Appointments.Add(appointment);
        if (coupon is not null)
        {
            coupon.UsageCount++;
        }

        await _db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        appointment.Staff = selectedOffering.Staff;
        appointment.Coupon = coupon;
        await _notifications.SendBookingConfirmationAsync(appointment, cancellationToken);
        return Map(appointment);
    }

    public async Task<BookingResponse> RescheduleAsync(
        Guid appointmentId,
        Guid customerId,
        RescheduleAppointmentRequest request,
        CancellationToken cancellationToken)
    {
        EnsureUtc(request.StartsAtUtc);
        var appointment = await FindCustomerAppointmentAsync(appointmentId, customerId, cancellationToken);
        EnsureCanChange(appointment);

        var item = appointment.Items.Single();
        var serviceId = item.ServiceId ?? throw ApiException.Conflict(
            "The original service is no longer bookable. Please contact the salon.",
            "service_unavailable");
        var staffId = request.StaffId ?? appointment.StaffId;
        var offering = await _db.StaffServices
            .Include(link => link.Staff)
            .SingleOrDefaultAsync(link => link.StaffId == staffId &&
                                          link.ServiceId == serviceId &&
                                          link.Staff.IsActive,
                cancellationToken)
            ?? throw ApiException.BadRequest("The selected technician does not offer this service.", "invalid_technician");

        var baseDuration = offering.CustomDurationMinutes ?? item.DurationMinutes;
        var duration = baseDuration + item.AddOns.Sum(addOn => addOn.DurationMinutes);
        if (!await _availability.IsStaffAvailableAsync(
                staffId,
                serviceId,
                request.StartsAtUtc,
                duration,
                appointment.Id,
                cancellationToken))
        {
            throw ApiException.Conflict("The requested time is unavailable.", "slot_unavailable");
        }

        appointment.StaffId = staffId;
        appointment.Staff = offering.Staff;
        appointment.StartsAtUtc = request.StartsAtUtc;
        appointment.EndsAtUtc = request.StartsAtUtc.AddMinutes(duration);
        item.DurationMinutes = baseDuration;
        await _db.SaveChangesAsync(cancellationToken);
        return Map(appointment);
    }

    public async Task<BookingResponse> CancelAsync(
        Guid appointmentId,
        Guid customerId,
        string reason,
        CancellationToken cancellationToken)
    {
        var appointment = await FindCustomerAppointmentAsync(appointmentId, customerId, cancellationToken);
        EnsureCanChange(appointment);
        appointment.Status = AppointmentStatus.Cancelled;
        appointment.CancellationReason = reason.Trim();
        appointment.CancelledAtUtc = _timeProvider.GetUtcNow().UtcDateTime;
        await _db.SaveChangesAsync(cancellationToken);
        return Map(appointment);
    }

    private async Task<Appointment> FindCustomerAppointmentAsync(
        Guid appointmentId,
        Guid customerId,
        CancellationToken cancellationToken) =>
        await _db.Appointments
            .Include(appointment => appointment.Staff)
            .Include(appointment => appointment.Items)
                .ThenInclude(item => item.AddOns)
            .SingleOrDefaultAsync(appointment => appointment.Id == appointmentId && appointment.CustomerId == customerId, cancellationToken)
        ?? throw ApiException.NotFound("Appointment not found.", "appointment_not_found");

    private void EnsureCanChange(Appointment appointment)
    {
        if (appointment.Status is AppointmentStatus.Completed or AppointmentStatus.Cancelled or AppointmentStatus.NoShow)
        {
            throw ApiException.Conflict("This appointment can no longer be changed.", "appointment_locked");
        }

        if (appointment.StartsAtUtc <= _timeProvider.GetUtcNow().UtcDateTime)
        {
            throw ApiException.Conflict("An appointment cannot be changed after its start time.", "appointment_started");
        }
    }

    private async Task<Coupon?> FindValidCouponAsync(
        string? code,
        decimal subtotal,
        bool forServices,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return null;
        }

        var normalized = code.Trim().ToUpperInvariant();
        var now = _timeProvider.GetUtcNow().UtcDateTime;
        var coupon = await _db.Coupons.SingleOrDefaultAsync(item => item.Code == normalized, cancellationToken)
            ?? throw ApiException.BadRequest("That promotion code is not valid.", "coupon_invalid");

        if (!coupon.IsActive || coupon.StartsAtUtc > now || coupon.EndsAtUtc < now ||
            (coupon.UsageLimit.HasValue && coupon.UsageCount >= coupon.UsageLimit.Value) ||
            (forServices && !coupon.AppliesToServices) ||
            (!forServices && !coupon.AppliesToProducts) ||
            (coupon.MinimumSpend.HasValue && subtotal < coupon.MinimumSpend.Value))
        {
            throw ApiException.BadRequest("That promotion code is not valid for this purchase.", "coupon_ineligible");
        }

        return coupon;
    }

    private static decimal CalculateDiscount(Coupon? coupon, decimal subtotal)
    {
        if (coupon is null)
        {
            return 0;
        }

        var discount = coupon.DiscountType == DiscountType.Percentage
            ? subtotal * coupon.DiscountValue / 100m
            : coupon.DiscountValue;
        if (coupon.MaximumDiscount.HasValue)
        {
            discount = Math.Min(discount, coupon.MaximumDiscount.Value);
        }

        return Math.Round(Math.Min(subtotal, discount), 2, MidpointRounding.AwayFromZero);
    }

    private static void EnsureUtc(DateTime value)
    {
        if (value.Kind != DateTimeKind.Utc)
        {
            throw ApiException.BadRequest("startsAtUtc must be an ISO-8601 UTC value ending in Z.", "utc_required");
        }
    }

    private static string CreateReference(string prefix) =>
        $"{prefix}{DateTime.UtcNow:yyMMdd}{Guid.NewGuid():N}"[..14].ToUpperInvariant();

    internal static BookingResponse Map(Appointment appointment) =>
        new(
            appointment.Id,
            appointment.Number,
            appointment.Status,
            appointment.PaymentStatus,
            appointment.StaffId,
            appointment.Staff.DisplayName,
            DateTime.SpecifyKind(appointment.StartsAtUtc, DateTimeKind.Utc),
            DateTime.SpecifyKind(appointment.EndsAtUtc, DateTimeKind.Utc),
            appointment.Subtotal,
            appointment.DiscountAmount,
            appointment.DepositAmount,
            appointment.Total,
            appointment.GuestEmail,
            appointment.Items.Select(item => new BookingLineDto(
                item.ServiceName,
                item.DurationMinutes,
                item.UnitPrice,
                item.AddOns.Select(addOn => new BookingAddOnLineDto(
                    addOn.Name,
                    addOn.DurationMinutes,
                    addOn.Price)).ToArray())).ToArray());
}
