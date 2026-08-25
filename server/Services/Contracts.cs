using Salon.Api.Domain.Entities;
using Salon.Api.DTOs;

namespace Salon.Api.Services;

public sealed record AccessTokenResult(string Token, DateTime ExpiresAtUtc);

public interface ITokenService
{
    AccessTokenResult Create(ApplicationUser user, IReadOnlyCollection<string> roles);
}

public interface IAvailabilityService
{
    Task<IReadOnlyCollection<AvailabilitySlotDto>> GetSlotsAsync(
        Guid serviceId,
        DateOnly date,
        Guid? staffId,
        CancellationToken cancellationToken);

    Task<bool> IsStaffAvailableAsync(
        Guid staffId,
        Guid serviceId,
        DateTime startsAtUtc,
        int durationMinutes,
        Guid? excludeAppointmentId,
        CancellationToken cancellationToken);
}

public interface IBookingService
{
    Task<BookingResponse> CreateAsync(
        CreateBookingRequest request,
        Guid? customerId,
        CancellationToken cancellationToken);

    Task<BookingResponse> RescheduleAsync(
        Guid appointmentId,
        Guid customerId,
        RescheduleAppointmentRequest request,
        CancellationToken cancellationToken);

    Task<BookingResponse> CancelAsync(
        Guid appointmentId,
        Guid customerId,
        string reason,
        CancellationToken cancellationToken);
}

public interface IShopService
{
    Task<OrderResponse> CheckoutAsync(
        CheckoutRequest request,
        Guid? customerId,
        CancellationToken cancellationToken);
}

public sealed record PaymentIntentResult(
    string? ExternalId,
    bool Paid,
    bool RequiresClientAction,
    string? ClientSecret);

public interface IPaymentGateway
{
    Task<PaymentIntentResult> CreateIntentAsync(
        decimal amount,
        string description,
        string? paymentMethodId,
        IReadOnlyDictionary<string, string> metadata,
        CancellationToken cancellationToken);
}

public interface INotificationSender
{
    Task SendBookingConfirmationAsync(Appointment appointment, CancellationToken cancellationToken);
}
