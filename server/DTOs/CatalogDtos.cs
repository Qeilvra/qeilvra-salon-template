namespace Salon.Api.DTOs;

public sealed record ServiceCategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    string? ImageUrl,
    int ServiceCount);

public sealed record ServiceCardDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    string Name,
    string Slug,
    string Summary,
    int DurationMinutes,
    decimal Price,
    decimal DepositAmount,
    string? ImageUrl,
    bool IsFeatured);

public sealed record AddOnDto(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    int DurationMinutes,
    decimal Price);

public sealed record ServiceDetailDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    string Name,
    string Slug,
    string Summary,
    string? Description,
    int DurationMinutes,
    decimal Price,
    decimal DepositAmount,
    string? ImageUrl,
    IReadOnlyCollection<AddOnDto> AddOns,
    IReadOnlyCollection<StaffCardDto> Technicians);

public sealed record StaffCardDto(
    Guid Id,
    string DisplayName,
    string Slug,
    string JobTitle,
    string? ImageUrl,
    int YearsExperience,
    decimal Rating,
    int ReviewCount,
    bool IsFeatured);

public sealed record StaffProfileDto(
    Guid Id,
    string DisplayName,
    string Slug,
    string JobTitle,
    string? Bio,
    string? ImageUrl,
    int YearsExperience,
    decimal Rating,
    int ReviewCount,
    IReadOnlyCollection<ServiceCardDto> Services);

public sealed record AvailabilitySlotDto(
    Guid StaffId,
    string StaffName,
    DateTime StartsAtUtc,
    DateTime EndsAtUtc,
    decimal Price,
    bool Available);
