using System.ComponentModel.DataAnnotations;
using Salon.Api.Domain;

namespace Salon.Api.DTOs;

public sealed class BookingCustomerRequest
{
    [Required, StringLength(80, MinimumLength = 2)]
    public string FirstName { get; init; } = string.Empty;

    [Required, StringLength(80, MinimumLength = 2)]
    public string LastName { get; init; } = string.Empty;

    [Required, EmailAddress, StringLength(256)]
    public string Email { get; init; } = string.Empty;

    [Required, Phone, StringLength(40)]
    public string Phone { get; init; } = string.Empty;
}

public sealed class CreateBookingRequest
{
    [Required]
    public Guid ServiceId { get; init; }

    public IReadOnlyCollection<Guid> AddOnIds { get; init; } = Array.Empty<Guid>();
    public Guid? StaffId { get; init; }

    [Required]
    public DateTime StartsAtUtc { get; init; }

    [Required]
    public BookingCustomerRequest Customer { get; init; } = new();

    [StringLength(1000)]
    public string? Notes { get; init; }

    [StringLength(40)]
    public string? CouponCode { get; init; }

    public bool PayDeposit { get; init; }

    [StringLength(120)]
    public string? PaymentMethodId { get; init; }
}

public sealed record BookingResponse(
    Guid Id,
    string Number,
    AppointmentStatus Status,
    PaymentStatus PaymentStatus,
    Guid StaffId,
    string StaffName,
    DateTime StartsAtUtc,
    DateTime EndsAtUtc,
    decimal Subtotal,
    decimal DiscountAmount,
    decimal DepositAmount,
    decimal Total,
    string CustomerEmail,
    IReadOnlyCollection<BookingLineDto> Items);

public sealed record BookingLineDto(
    string ServiceName,
    int DurationMinutes,
    decimal Price,
    IReadOnlyCollection<BookingAddOnLineDto> AddOns);

public sealed record BookingAddOnLineDto(
    string Name,
    int DurationMinutes,
    decimal Price);

public sealed class RescheduleAppointmentRequest
{
    [Required]
    public DateTime StartsAtUtc { get; init; }

    public Guid? StaffId { get; init; }
}

public sealed class CancelAppointmentRequest
{
    [Required, StringLength(500, MinimumLength = 3)]
    public string Reason { get; init; } = string.Empty;
}
