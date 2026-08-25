using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Data;
using Salon.Api.Domain;
using Salon.Api.Domain.Entities;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;
using Salon.Api.Services;

namespace Salon.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin,Manager")]
[Route("api/v1/admin")]
public sealed class AdminController : ControllerBase
{
    private readonly SalonDbContext _db;

    public AdminController(SalonDbContext db)
    {
        _db = db;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<AdminSummaryDto>> Summary(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var today = now.Date;
        var tomorrow = today.AddDays(1);
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var sevenDayStart = today.AddDays(-6);

        var appointmentRevenueToday = await AppointmentRevenue(today, tomorrow, cancellationToken);
        var orderRevenueToday = await OrderRevenue(today, tomorrow, cancellationToken);
        var appointmentRevenueMonth = await AppointmentRevenue(monthStart, tomorrow, cancellationToken);
        var orderRevenueMonth = await OrderRevenue(monthStart, tomorrow, cancellationToken);
        var appointmentsToday = await _db.Appointments.CountAsync(
            appointment => appointment.StartsAtUtc >= today &&
                           appointment.StartsAtUtc < tomorrow &&
                           appointment.Status != AppointmentStatus.Cancelled,
            cancellationToken);
        var upcoming = await _db.Appointments.CountAsync(
            appointment => appointment.StartsAtUtc >= now &&
                           appointment.Status != AppointmentStatus.Cancelled,
            cancellationToken);
        var newCustomers = await _db.Users.CountAsync(user => user.CreatedAtUtc >= monthStart, cancellationToken);
        var pendingReviews = await _db.Reviews.CountAsync(review => review.Status == ReviewStatus.Pending, cancellationToken);
        var lowStock = await _db.Products.CountAsync(
            product => product.IsActive && product.TrackInventory && product.StockQuantity <= 5,
            cancellationToken);

        var dailyAppointments = await _db.Appointments
            .AsNoTracking()
            .Where(appointment => appointment.StartsAtUtc >= sevenDayStart && appointment.StartsAtUtc < tomorrow)
            .Select(appointment => new
            {
                appointment.StartsAtUtc,
                appointment.Status,
                appointment.PaymentStatus,
                appointment.Total,
                appointment.DepositAmount
            })
            .ToListAsync(cancellationToken);
        var dailyOrders = await _db.Orders
            .AsNoTracking()
            .Where(order => order.CreatedAtUtc >= sevenDayStart && order.CreatedAtUtc < tomorrow)
            .Select(order => new { order.CreatedAtUtc, order.PaymentStatus, order.Total })
            .ToListAsync(cancellationToken);
        var points = Enumerable.Range(0, 7)
            .Select(offset => DateOnly.FromDateTime(sevenDayStart.AddDays(offset)))
            .Select(date =>
            {
                var revenue = dailyAppointments
                                  .Where(item => DateOnly.FromDateTime(item.StartsAtUtc) == date)
                                  .Sum(item => item.PaymentStatus == PaymentStatus.Paid
                                      ? item.Total
                                      : item.PaymentStatus == PaymentStatus.DepositPaid ? item.DepositAmount : 0m) +
                              dailyOrders
                                  .Where(item => DateOnly.FromDateTime(item.CreatedAtUtc) == date && item.PaymentStatus == PaymentStatus.Paid)
                                  .Sum(item => item.Total);
                var count = dailyAppointments.Count(item =>
                    DateOnly.FromDateTime(item.StartsAtUtc) == date && item.Status != AppointmentStatus.Cancelled);
                return new AdminMetricPointDto(date, revenue, count);
            })
            .ToArray();

        return Ok(new AdminSummaryDto(
            appointmentRevenueToday + orderRevenueToday,
            appointmentRevenueMonth + orderRevenueMonth,
            appointmentsToday,
            upcoming,
            newCustomers,
            pendingReviews,
            lowStock,
            points));
    }

    [HttpGet("appointments")]
    public async Task<ActionResult<PagedResult<BookingResponse>>> Appointments(
        [FromQuery] DateTime? fromUtc,
        [FromQuery] DateTime? toUtc,
        [FromQuery] AppointmentStatus? status,
        [FromQuery] Guid? staffId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 30,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var query = _db.Appointments.AsNoTracking().AsQueryable();
        if (fromUtc.HasValue) query = query.Where(item => item.StartsAtUtc >= fromUtc.Value);
        if (toUtc.HasValue) query = query.Where(item => item.StartsAtUtc < toUtc.Value);
        if (status.HasValue) query = query.Where(item => item.Status == status.Value);
        if (staffId.HasValue) query = query.Where(item => item.StaffId == staffId.Value);

        var total = await query.CountAsync(cancellationToken);
        var appointments = await query
            .Include(item => item.Staff)
            .Include(item => item.Items).ThenInclude(item => item.AddOns)
            .OrderBy(item => item.StartsAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        return Ok(new PagedResult<BookingResponse>(
            appointments.Select(BookingService.Map).ToArray(),
            page,
            pageSize,
            total));
    }

    [HttpPatch("appointments/{id:guid}/status")]
    public async Task<ActionResult<BookingResponse>> UpdateAppointmentStatus(
        Guid id,
        UpdateAppointmentStatusRequest request,
        CancellationToken cancellationToken)
    {
        var appointment = await _db.Appointments
            .Include(item => item.Staff)
            .Include(item => item.Items).ThenInclude(item => item.AddOns)
            .SingleOrDefaultAsync(item => item.Id == id, cancellationToken)
            ?? throw ApiException.NotFound("Appointment not found.", "appointment_not_found");
        appointment.Status = request.Status;
        if (request.Status == AppointmentStatus.Cancelled)
        {
            appointment.CancellationReason = request.InternalNote?.Trim() ?? "Cancelled by salon";
            appointment.CancelledAtUtc = DateTime.UtcNow;
        }
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(BookingService.Map(appointment));
    }

    [HttpGet("customers")]
    public async Task<ActionResult<object>> Customers(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 30,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var query = _db.Users.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(user => user.FirstName.Contains(term) ||
                                        user.LastName.Contains(term) ||
                                        (user.Email != null && user.Email.Contains(term)));
        }

        var total = await query.CountAsync(cancellationToken);
        var customers = await query
            .OrderByDescending(user => user.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(user => new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.LoyaltyPoints,
                user.CreatedAtUtc,
                AppointmentCount = user.Appointments.Count
            })
            .ToListAsync(cancellationToken);
        return Ok(new { items = customers, page, pageSize, totalCount = total });
    }

    [HttpPost("time-off")]
    public async Task<ActionResult<object>> BlockTime(
        CreateTimeOffRequest request,
        CancellationToken cancellationToken)
    {
        if (request.StartsAtUtc.Kind != DateTimeKind.Utc || request.EndsAtUtc.Kind != DateTimeKind.Utc ||
            request.EndsAtUtc <= request.StartsAtUtc)
        {
            throw ApiException.BadRequest("Provide a valid UTC time range.", "invalid_time_range");
        }
        if (request.StaffId.HasValue &&
            !await _db.StaffMembers.AnyAsync(item => item.Id == request.StaffId, cancellationToken))
        {
            throw ApiException.NotFound("Technician not found.", "staff_not_found");
        }

        var block = new StaffTimeOff
        {
            StaffId = request.StaffId,
            StartsAtUtc = request.StartsAtUtc,
            EndsAtUtc = request.EndsAtUtc,
            Reason = request.Reason?.Trim()
        };
        _db.StaffTimeOff.Add(block);
        await _db.SaveChangesAsync(cancellationToken);
        return Created($"/api/v1/admin/time-off/{block.Id}", new
        {
            block.Id,
            block.StaffId,
            block.StartsAtUtc,
            block.EndsAtUtc,
            block.Reason
        });
    }

    private Task<decimal> AppointmentRevenue(DateTime from, DateTime to, CancellationToken cancellationToken) =>
        _db.Appointments
            .Where(item => item.StartsAtUtc >= from && item.StartsAtUtc < to)
            .SumAsync(item => item.PaymentStatus == PaymentStatus.Paid
                ? item.Total
                : item.PaymentStatus == PaymentStatus.DepositPaid ? item.DepositAmount : 0m,
                cancellationToken);

    private Task<decimal> OrderRevenue(DateTime from, DateTime to, CancellationToken cancellationToken) =>
        _db.Orders
            .Where(item => item.CreatedAtUtc >= from && item.CreatedAtUtc < to && item.PaymentStatus == PaymentStatus.Paid)
            .SumAsync(item => item.Total, cancellationToken);
}
