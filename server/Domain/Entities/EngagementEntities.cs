using Salon.Api.Domain;

namespace Salon.Api.Domain.Entities;

public sealed class BlogPost : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string? HeroImageUrl { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string? TagsCsv { get; set; }
    public bool IsPublished { get; set; }
    public DateTime? PublishedAtUtc { get; set; }
}

public sealed class ContentPage : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public bool IsPublished { get; set; }
}

public sealed class GalleryImage : AuditableEntity
{
    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string AltText { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public string? Category { get; set; }
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}

public sealed class ContactInquiry : AuditableEntity
{
    public string InquiryType { get; set; } = "General";
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int? PartySize { get; set; }
    public DateTime? PreferredEventDateUtc { get; set; }
    public ContactInquiryStatus Status { get; set; } = ContactInquiryStatus.New;
    public string? InternalNotes { get; set; }
}

public sealed class NewsletterSubscriber : AuditableEntity
{
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public string? Source { get; set; }
    public DateTime? UnsubscribedAtUtc { get; set; }
}
