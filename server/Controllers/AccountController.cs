using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Data;
using Salon.Api.Domain.Entities;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;
using Salon.Api.Services;

namespace Salon.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/account")]
public sealed class AccountController : ControllerBase
{
    private readonly SalonDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IBookingService _bookings;

    public AccountController(
        SalonDbContext db,
        UserManager<ApplicationUser> userManager,
        IBookingService bookings)
    {
        _db = db;
        _userManager = userManager;
        _bookings = bookings;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<AccountProfileDto>> Profile()
    {
        var user = await FindUserAsync();
        return Ok(MapProfile(user));
    }

    [HttpPut("profile")]
    public async Task<ActionResult<AccountProfileDto>> UpdateProfile(UpdateProfileRequest request)
    {
        var user = await FindUserAsync();
        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        user.PhoneNumber = request.Phone?.Trim();
        user.DateOfBirth = request.DateOfBirth;
        user.MarketingEmailsOptIn = request.MarketingEmailsOptIn;
        user.SmsOptIn = request.SmsOptIn;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw ApiException.BadRequest(string.Join(" ", result.Errors.Select(error => error.Description)));
        }

        return Ok(MapProfile(user));
    }

    [HttpGet("appointments")]
    public async Task<ActionResult<PagedResult<BookingResponse>>> Appointments(
        [FromQuery] bool? upcoming,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var userId = User.RequireUserId();
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var now = DateTime.UtcNow;
        var query = _db.Appointments
            .AsNoTracking()
            .Where(appointment => appointment.CustomerId == userId);
        if (upcoming == true)
        {
            query = query.Where(appointment => appointment.StartsAtUtc >= now &&
                                               appointment.Status != Domain.AppointmentStatus.Cancelled);
        }
        else if (upcoming == false)
        {
            query = query.Where(appointment => appointment.StartsAtUtc < now ||
                                               appointment.Status == Domain.AppointmentStatus.Cancelled);
        }

        var total = await query.CountAsync(cancellationToken);
        var appointments = await query
            .Include(appointment => appointment.Staff)
            .Include(appointment => appointment.Items).ThenInclude(item => item.AddOns)
            .OrderByDescending(appointment => appointment.StartsAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        return Ok(new PagedResult<BookingResponse>(
            appointments.Select(BookingService.Map).ToArray(),
            page,
            pageSize,
            total));
    }

    [HttpPost("appointments/{id:guid}/reschedule")]
    public async Task<ActionResult<BookingResponse>> Reschedule(
        Guid id,
        RescheduleAppointmentRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _bookings.RescheduleAsync(id, User.RequireUserId(), request, cancellationToken);
        return Ok(response);
    }

    [HttpPost("appointments/{id:guid}/cancel")]
    public async Task<ActionResult<BookingResponse>> Cancel(
        Guid id,
        CancelAppointmentRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _bookings.CancelAsync(id, User.RequireUserId(), request.Reason, cancellationToken);
        return Ok(response);
    }

    [HttpGet("loyalty")]
    public async Task<ActionResult<LoyaltySummaryDto>> Loyalty(CancellationToken cancellationToken)
    {
        var userId = User.RequireUserId();
        var balance = await _db.Users
            .Where(user => user.Id == userId)
            .Select(user => user.LoyaltyPoints)
            .SingleAsync(cancellationToken);
        var activity = await _db.LoyaltyTransactions
            .AsNoTracking()
            .Where(item => item.CustomerId == userId)
            .OrderByDescending(item => item.CreatedAtUtc)
            .Take(20)
            .Select(item => new LoyaltyTransactionDto(
                item.Id,
                item.Type.ToString(),
                item.Points,
                item.BalanceAfter,
                item.Description,
                item.CreatedAtUtc))
            .ToListAsync(cancellationToken);
        var nextRewardAt = ((balance / 500) + 1) * 500;
        return Ok(new LoyaltySummaryDto(balance, nextRewardAt - balance, activity));
    }

    [HttpGet("orders")]
    public async Task<ActionResult<IReadOnlyCollection<OrderResponse>>> Orders(CancellationToken cancellationToken)
    {
        var orders = await _db.Orders
            .AsNoTracking()
            .Where(order => order.CustomerId == User.RequireUserId())
            .Include(order => order.Items)
            .OrderByDescending(order => order.CreatedAtUtc)
            .Take(50)
            .ToListAsync(cancellationToken);
        return Ok(orders.Select(ShopService.Map).ToArray());
    }

    private async Task<ApplicationUser> FindUserAsync() =>
        await _userManager.FindByIdAsync(User.RequireUserId().ToString())
        ?? throw ApiException.NotFound("Account not found.", "account_not_found");

    private static AccountProfileDto MapProfile(ApplicationUser user) =>
        new(
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email ?? string.Empty,
            user.PhoneNumber,
            user.DateOfBirth,
            user.AvatarUrl,
            user.MarketingEmailsOptIn,
            user.SmsOptIn,
            user.LoyaltyPoints);
}
