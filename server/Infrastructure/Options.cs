namespace Salon.Api.Infrastructure;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    public string Key { get; init; } = string.Empty;
    public int ExpiryMinutes { get; init; } = 60;
}

public sealed class SalonOptions
{
    public const string SectionName = "Salon";
    public string TimeZoneId { get; init; } = "Central Standard Time";
    public int SlotIntervalMinutes { get; init; } = 15;
    public int MinimumBookingLeadMinutes { get; init; } = 60;
    public int MaximumBookingDaysAhead { get; init; } = 120;
}

public sealed class StripeOptions
{
    public const string SectionName = "Stripe";
    public string SecretKey { get; init; } = string.Empty;
    public string Currency { get; init; } = "usd";
}
