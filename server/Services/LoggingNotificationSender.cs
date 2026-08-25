using Salon.Api.Domain.Entities;

namespace Salon.Api.Services;

public sealed class LoggingNotificationSender : INotificationSender
{
    private readonly ILogger<LoggingNotificationSender> _logger;

    public LoggingNotificationSender(ILogger<LoggingNotificationSender> logger)
    {
        _logger = logger;
    }

    public Task SendBookingConfirmationAsync(Appointment appointment, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Booking confirmation queued for {BookingNumber} to {Email} and {Phone}. " +
            "Replace LoggingNotificationSender with SendGrid/Twilio adapters in production.",
            appointment.Number,
            appointment.GuestEmail,
            appointment.GuestPhone);
        return Task.CompletedTask;
    }
}
