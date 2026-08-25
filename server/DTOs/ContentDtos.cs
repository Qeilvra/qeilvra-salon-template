using System.ComponentModel.DataAnnotations;

namespace Salon.Api.DTOs;

public sealed record ReviewDto(
    Guid Id,
    string DisplayName,
    int Rating,
    string? Title,
    string Comment,
    string? ServiceName,
    string? StaffName,
    DateTime? PublishedAtUtc);

public sealed record BlogPostCardDto(
    Guid Id,
    string Title,
    string Slug,
    string Excerpt,
    string? HeroImageUrl,
    string AuthorName,
    DateTime? PublishedAtUtc);

public sealed record BlogPostDetailDto(
    Guid Id,
    string Title,
    string Slug,
    string Excerpt,
    string ContentHtml,
    string? HeroImageUrl,
    string AuthorName,
    IReadOnlyCollection<string> Tags,
    DateTime? PublishedAtUtc);

public sealed class ContactInquiryRequest
{
    [Required, StringLength(80)]
    public string FirstName { get; init; } = string.Empty;

    [Required, StringLength(80)]
    public string LastName { get; init; } = string.Empty;

    [Required, EmailAddress, StringLength(256)]
    public string Email { get; init; } = string.Empty;

    [Phone, StringLength(40)]
    public string? Phone { get; init; }

    [Required, StringLength(80)]
    public string InquiryType { get; init; } = "General";

    [Required, StringLength(200)]
    public string Subject { get; init; } = string.Empty;

    [Required, StringLength(4000, MinimumLength = 10)]
    public string Message { get; init; } = string.Empty;

    [Range(1, 200)]
    public int? PartySize { get; init; }

    public DateTime? PreferredEventDateUtc { get; init; }
}

public sealed class NewsletterRequest
{
    [Required, EmailAddress, StringLength(256)]
    public string Email { get; init; } = string.Empty;

    [StringLength(80)]
    public string? Source { get; init; }
}

public sealed record AdminSummaryDto(
    decimal RevenueToday,
    decimal RevenueThisMonth,
    int AppointmentsToday,
    int UpcomingAppointments,
    int NewCustomersThisMonth,
    int PendingReviews,
    int LowStockProducts,
    IReadOnlyCollection<AdminMetricPointDto> SevenDayRevenue);

public sealed record AdminMetricPointDto(DateOnly Date, decimal Revenue, int Appointments);

public sealed class UpdateAppointmentStatusRequest
{
    [Required]
    public Domain.AppointmentStatus Status { get; init; }

    [StringLength(500)]
    public string? InternalNote { get; init; }
}

public sealed class CreateTimeOffRequest
{
    public Guid? StaffId { get; init; }

    [Required]
    public DateTime StartsAtUtc { get; init; }

    [Required]
    public DateTime EndsAtUtc { get; init; }

    [StringLength(250)]
    public string? Reason { get; init; }
}
