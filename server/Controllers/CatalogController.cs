using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Data;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;

namespace Salon.Api.Controllers;

[ApiController]
[Route("api/v1/catalog")]
public sealed class CatalogController : ControllerBase
{
    private readonly SalonDbContext _db;

    public CatalogController(SalonDbContext db)
    {
        _db = db;
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyCollection<ServiceCategoryDto>>> Categories(CancellationToken cancellationToken)
    {
        var categories = await _db.ServiceCategories
            .AsNoTracking()
            .Where(category => category.IsActive)
            .OrderBy(category => category.SortOrder)
            .Select(category => new ServiceCategoryDto(
                category.Id,
                category.Name,
                category.Slug,
                category.Description,
                category.ImageUrl,
                category.Services.Count(service => service.IsActive)))
            .ToListAsync(cancellationToken);
        return Ok(categories);
    }

    [HttpGet("services")]
    public async Task<ActionResult<PagedResult<ServiceCardDto>>> Services(
        [FromQuery] string? category,
        [FromQuery] bool? featured,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var query = _db.Services.AsNoTracking().Where(service => service.IsActive);
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(service => service.Category.Slug == category);
        }
        if (featured.HasValue)
        {
            query = query.Where(service => service.IsFeatured == featured.Value);
        }
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(service => service.Name.Contains(term) || service.Summary.Contains(term));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(service => service.Category.SortOrder)
            .ThenBy(service => service.SortOrder)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(service => new ServiceCardDto(
                service.Id,
                service.CategoryId,
                service.Category.Name,
                service.Name,
                service.Slug,
                service.Summary,
                service.DurationMinutes,
                service.Price,
                service.DepositAmount,
                service.ImageUrl,
                service.IsFeatured))
            .ToListAsync(cancellationToken);
        return Ok(new PagedResult<ServiceCardDto>(items, page, pageSize, total));
    }

    [HttpGet("services/{slug}")]
    public async Task<ActionResult<ServiceDetailDto>> Service(string slug, CancellationToken cancellationToken)
    {
        var service = await _db.Services
            .AsNoTracking()
            .Include(item => item.Category)
            .Include(item => item.ServiceAddOns).ThenInclude(item => item.AddOn)
            .Include(item => item.StaffServices).ThenInclude(item => item.Staff)
            .SingleOrDefaultAsync(item => item.Slug == slug && item.IsActive, cancellationToken)
            ?? throw ApiException.NotFound("Service not found.", "service_not_found");

        return Ok(new ServiceDetailDto(
            service.Id,
            service.CategoryId,
            service.Category.Name,
            service.Name,
            service.Slug,
            service.Summary,
            service.Description,
            service.DurationMinutes,
            service.Price,
            service.DepositAmount,
            service.ImageUrl,
            service.ServiceAddOns
                .Where(link => link.AddOn.IsActive)
                .Select(link => new AddOnDto(
                    link.AddOn.Id,
                    link.AddOn.Name,
                    link.AddOn.Slug,
                    link.AddOn.Description,
                    link.AddOn.DurationMinutes,
                    link.AddOn.Price))
                .ToArray(),
            service.StaffServices
                .Where(link => link.Staff.IsActive)
                .Select(link => MapStaff(link.Staff))
                .ToArray()));
    }

    [HttpGet("add-ons")]
    public async Task<ActionResult<IReadOnlyCollection<AddOnDto>>> AddOns(
        [FromQuery] Guid? serviceId,
        CancellationToken cancellationToken)
    {
        var query = _db.AddOns.AsNoTracking().Where(addOn => addOn.IsActive);
        if (serviceId.HasValue)
        {
            query = query.Where(addOn => addOn.ServiceAddOns.Any(link => link.ServiceId == serviceId));
        }

        var items = await query
            .OrderBy(addOn => addOn.Name)
            .Select(addOn => new AddOnDto(
                addOn.Id,
                addOn.Name,
                addOn.Slug,
                addOn.Description,
                addOn.DurationMinutes,
                addOn.Price))
            .ToListAsync(cancellationToken);
        return Ok(items);
    }

    private static StaffCardDto MapStaff(Domain.Entities.StaffMember staff) =>
        new(
            staff.Id,
            staff.DisplayName,
            staff.Slug,
            staff.JobTitle,
            staff.ImageUrl,
            staff.YearsExperience,
            staff.Rating,
            staff.ReviewCount,
            staff.IsFeatured);
}
