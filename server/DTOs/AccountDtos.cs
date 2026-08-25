using System.ComponentModel.DataAnnotations;

namespace Salon.Api.DTOs;

public sealed record AccountProfileDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    DateOnly? DateOfBirth,
    string? AvatarUrl,
    bool MarketingEmailsOptIn,
    bool SmsOptIn,
    int LoyaltyPoints);

public sealed class UpdateProfileRequest
{
    [Required, StringLength(80, MinimumLength = 2)]
    public string FirstName { get; init; } = string.Empty;

    [Required, StringLength(80, MinimumLength = 2)]
    public string LastName { get; init; } = string.Empty;

    [Phone, StringLength(40)]
    public string? Phone { get; init; }

    public DateOnly? DateOfBirth { get; init; }
    public bool MarketingEmailsOptIn { get; init; }
    public bool SmsOptIn { get; init; }
}

public sealed record LoyaltySummaryDto(
    int Balance,
    int PointsUntilNextReward,
    IReadOnlyCollection<LoyaltyTransactionDto> RecentActivity);

public sealed record LoyaltyTransactionDto(
    Guid Id,
    string Type,
    int Points,
    int BalanceAfter,
    string Description,
    DateTime CreatedAtUtc);
