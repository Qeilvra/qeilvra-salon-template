using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Data;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;

namespace Salon.Api.Controllers;

[ApiController]
[Route("api/v1/staff")]
public sealed class StaffController : ControllerBase
{
    private readonly SalonDbContext _db;

    public StaffController(SalonDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<StaffCardDto>>> List(
        [FromQuery] Guid? serviceId,
        [FromQuery] bool? featured,
        CancellationToken cancellationToken)
    {
        var query = _db.StaffMembers.AsNoTracking().Where(staff => staff.IsActive);
        if (serviceId.HasValue)
        {
            query = query.Where(staff => staff.StaffServices.Any(link => link.ServiceId == serviceId));
        }
        if (featured.HasValue)
        {
            query = query.Where(staff => staff.IsFeatured == featured.Value);
        }

        var staff = await query
            .OrderByDescending(item => item.IsFeatured)
            .ThenBy(item => item.DisplayName)
            .Select(item => new StaffCardDto(
                item.Id,
                item.DisplayName,
                item.Slug,
                item.JobTitle,
                item.ImageUrl,
                item.YearsExperience,
                item.Rating,
                item.ReviewCount,
                item.IsFeatured))
            .ToListAsync(cancellationToken);
        return Ok(staff);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<StaffProfileDto>> Profile(string slug, CancellationToken cancellationToken)
    {
        var staff = await _db.StaffMembers
            .AsNoTracking()
            .Include(item => item.StaffServices).ThenInclude(link => link.Service).ThenInclude(service => service.Category)
            .SingleOrDefaultAsync(item => item.Slug == slug && item.IsActive, cancellationToken)
            ?? throw ApiException.NotFound("Technician not found.", "staff_not_found");

        return Ok(new StaffProfileDto(
            staff.Id,
            staff.DisplayName,
            staff.Slug,
            staff.JobTitle,
            staff.Bio,
            staff.ImageUrl,
            staff.YearsExperience,
            staff.Rating,
            staff.ReviewCount,
            staff.StaffServices
                .Where(link => link.Service.IsActive)
                .Select(link => new ServiceCardDto(
                    link.Service.Id,
                    link.Service.CategoryId,
                    link.Service.Category.Name,
                    link.Service.Name,
                    link.Service.Slug,
                    link.Service.Summary,
                    link.CustomDurationMinutes ?? link.Service.DurationMinutes,
                    link.CustomPrice ?? link.Service.Price,
                    link.Service.DepositAmount,
                    link.Service.ImageUrl,
                    link.Service.IsFeatured))
                .ToArray()));
    }
}
