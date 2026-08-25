using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Data;
using Salon.Api.Domain.Entities;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;

namespace Salon.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/v1/content")]
public sealed class ContentController : ControllerBase
{
    private readonly SalonDbContext _db;

    public ContentController(SalonDbContext db)
    {
        _db = db;
    }

    [HttpGet("reviews")]
    public async Task<ActionResult<PagedResult<ReviewDto>>> Reviews(
        [FromQuery] bool? featured,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);
        var query = _db.Reviews.AsNoTracking().Where(review => review.Status == Domain.ReviewStatus.Approved);
        if (featured.HasValue)
        {
            query = query.Where(review => review.IsFeatured == featured);
        }

        var total = await query.CountAsync(cancellationToken);
        var reviews = await query
            .OrderByDescending(review => review.PublishedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(review => new ReviewDto(
                review.Id,
                review.DisplayName,
                review.Rating,
                review.Title,
                review.Comment,
                review.Service != null ? review.Service.Name : null,
                review.Staff != null ? review.Staff.DisplayName : null,
                review.PublishedAtUtc))
            .ToListAsync(cancellationToken);
        return Ok(new PagedResult<ReviewDto>(reviews, page, pageSize, total));
    }

    [HttpGet("blog")]
    public async Task<ActionResult<PagedResult<BlogPostCardDto>>> Blog(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);
        var query = _db.BlogPosts.AsNoTracking().Where(post => post.IsPublished);
        var total = await query.CountAsync(cancellationToken);
        var posts = await query
            .OrderByDescending(post => post.PublishedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(post => new BlogPostCardDto(
                post.Id,
                post.Title,
                post.Slug,
                post.Excerpt,
                post.HeroImageUrl,
                post.AuthorName,
                post.PublishedAtUtc))
            .ToListAsync(cancellationToken);
        return Ok(new PagedResult<BlogPostCardDto>(posts, page, pageSize, total));
    }

    [HttpGet("blog/{slug}")]
    public async Task<ActionResult<BlogPostDetailDto>> BlogPost(string slug, CancellationToken cancellationToken)
    {
        var post = await _db.BlogPosts
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Slug == slug && item.IsPublished, cancellationToken)
            ?? throw ApiException.NotFound("Article not found.", "article_not_found");
        var tags = (post.TagsCsv ?? string.Empty)
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return Ok(new BlogPostDetailDto(
            post.Id,
            post.Title,
            post.Slug,
            post.Excerpt,
            post.ContentHtml,
            post.HeroImageUrl,
            post.AuthorName,
            tags,
            post.PublishedAtUtc));
    }

    [HttpGet("gallery")]
    public async Task<ActionResult<object>> Gallery(
        [FromQuery] string? category,
        CancellationToken cancellationToken)
    {
        var query = _db.GalleryImages.AsNoTracking().Where(image => image.IsPublished);
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(image => image.Category == category);
        }

        return Ok(await query.OrderBy(image => image.SortOrder).ToListAsync(cancellationToken));
    }

    [HttpGet("memberships")]
    public async Task<ActionResult<object>> Memberships(CancellationToken cancellationToken) =>
        Ok(await _db.MembershipPlans
            .AsNoTracking()
            .Where(plan => plan.IsActive)
            .OrderBy(plan => plan.MonthlyPrice)
            .Select(plan => new
            {
                plan.Id,
                plan.Name,
                plan.Slug,
                plan.Description,
                plan.MonthlyPrice,
                plan.MonthlyCredits,
                plan.ServiceDiscountPercent,
                plan.BenefitsJson
            })
            .ToListAsync(cancellationToken));

    [HttpGet("offers")]
    public async Task<ActionResult<object>> Offers(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        return Ok(await _db.Coupons
            .AsNoTracking()
            .Where(coupon => coupon.IsActive && coupon.StartsAtUtc <= now && coupon.EndsAtUtc >= now)
            .Select(coupon => new
            {
                coupon.Name,
                coupon.Description,
                coupon.DiscountType,
                coupon.DiscountValue,
                coupon.EndsAtUtc
            })
            .ToListAsync(cancellationToken));
    }

    [HttpPost("contact")]
    public async Task<ActionResult<MessageResponse>> Contact(
        ContactInquiryRequest request,
        CancellationToken cancellationToken)
    {
        _db.ContactInquiries.Add(new ContactInquiry
        {
            InquiryType = request.InquiryType.Trim(),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = request.Phone?.Trim(),
            Subject = request.Subject.Trim(),
            Message = request.Message.Trim(),
            PartySize = request.PartySize,
            PreferredEventDateUtc = request.PreferredEventDateUtc
        });
        await _db.SaveChangesAsync(cancellationToken);
        return Accepted(new MessageResponse("Thank you. The salon concierge will be in touch shortly."));
    }

    [HttpPost("newsletter")]
    public async Task<ActionResult<MessageResponse>> Newsletter(
        NewsletterRequest request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var subscriber = await _db.NewsletterSubscribers.SingleOrDefaultAsync(item => item.Email == email, cancellationToken);
        if (subscriber is null)
        {
            _db.NewsletterSubscribers.Add(new NewsletterSubscriber
            {
                Email = email,
                Source = request.Source?.Trim(),
                IsActive = true
            });
        }
        else
        {
            subscriber.IsActive = true;
            subscriber.UnsubscribedAtUtc = null;
            subscriber.Source = request.Source?.Trim() ?? subscriber.Source;
        }

        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new MessageResponse("You are on the Maison list."));
    }
}
