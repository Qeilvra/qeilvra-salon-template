using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Data;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;
using Salon.Api.Services;

namespace Salon.Api.Controllers;

[ApiController]
[Route("api/v1/bookings")]
public sealed class BookingsController : ControllerBase
{
    private readonly SalonDbContext _db;
    private readonly IBookingService _bookings;

    public BookingsController(SalonDbContext db, IBookingService bookings)
    {
        _db = db;
        _bookings = bookings;
    }

    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType<BookingResponse>(StatusCodes.Status201Created)]
    public async Task<ActionResult<BookingResponse>> Create(
        CreateBookingRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _bookings.CreateAsync(request, User.GetUserId(), cancellationToken);
        return CreatedAtAction(
            nameof(Confirmation),
            new { number = result.Number, email = result.CustomerEmail },
            result);
    }

    [HttpGet("confirmation/{number}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookingResponse>> Confirmation(
        string number,
        [FromQuery] string email,
        CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var appointment = await _db.Appointments
            .AsNoTracking()
            .Include(item => item.Staff)
            .Include(item => item.Items).ThenInclude(item => item.AddOns)
            .SingleOrDefaultAsync(item => item.Number == number && item.GuestEmail == normalizedEmail, cancellationToken)
            ?? throw ApiException.NotFound("Booking confirmation not found.", "booking_not_found");
        return Ok(BookingService.Map(appointment));
    }
}
