using System.ComponentModel.DataAnnotations;

namespace Salon.Api.DTOs;

public sealed class RegisterRequest
{
    [Required, StringLength(80, MinimumLength = 2)]
    public string FirstName { get; init; } = string.Empty;

    [Required, StringLength(80, MinimumLength = 2)]
    public string LastName { get; init; } = string.Empty;

    [Required, EmailAddress, StringLength(256)]
    public string Email { get; init; } = string.Empty;

    [Required, StringLength(100, MinimumLength = 10)]
    public string Password { get; init; } = string.Empty;

    [Phone, StringLength(40)]
    public string? Phone { get; init; }

    public bool MarketingEmailsOptIn { get; init; }
    public bool SmsOptIn { get; init; }
}

public sealed class LoginRequest
{
    [Required, EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;
}

public sealed record AuthResponse(
    string AccessToken,
    DateTime ExpiresAtUtc,
    AccountUserDto User);

public sealed record AccountUserDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    int LoyaltyPoints,
    IReadOnlyCollection<string> Roles);
