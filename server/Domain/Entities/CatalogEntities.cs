using Salon.Api.Domain;

namespace Salon.Api.Domain.Entities;

public sealed class ServiceCategory : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<SalonService> Services { get; set; } = new List<SalonService>();
}

public sealed class SalonService : AuditableEntity
{
    public Guid CategoryId { get; set; }
    public ServiceCategory Category { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public decimal DepositAmount { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }

    public ICollection<ServiceAddOn> ServiceAddOns { get; set; } = new List<ServiceAddOn>();
    public ICollection<StaffService> StaffServices { get; set; } = new List<StaffService>();
}

public sealed class AddOn : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<ServiceAddOn> ServiceAddOns { get; set; } = new List<ServiceAddOn>();
}

public sealed class ServiceAddOn
{
    public Guid ServiceId { get; set; }
    public SalonService Service { get; set; } = null!;
    public Guid AddOnId { get; set; }
    public AddOn AddOn { get; set; } = null!;
}

public sealed class StaffMember : AuditableEntity
{
    public Guid? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? ImageUrl { get; set; }
    public int YearsExperience { get; set; }
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<StaffService> StaffServices { get; set; } = new List<StaffService>();
    public ICollection<StaffAvailability> Availability { get; set; } = new List<StaffAvailability>();
    public ICollection<StaffTimeOff> TimeOff { get; set; } = new List<StaffTimeOff>();
}

public sealed class StaffService
{
    public Guid StaffId { get; set; }
    public StaffMember Staff { get; set; } = null!;
    public Guid ServiceId { get; set; }
    public SalonService Service { get; set; } = null!;
    public decimal? CustomPrice { get; set; }
    public int? CustomDurationMinutes { get; set; }
}

public sealed class StaffAvailability : AuditableEntity
{
    public Guid StaffId { get; set; }
    public StaffMember Staff { get; set; } = null!;
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsActive { get; set; } = true;
}

public sealed class StaffTimeOff : AuditableEntity
{
    public Guid? StaffId { get; set; }
    public StaffMember? Staff { get; set; }
    public DateTime StartsAtUtc { get; set; }
    public DateTime EndsAtUtc { get; set; }
    public string? Reason { get; set; }
}
