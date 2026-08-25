using Microsoft.AspNetCore.Identity;
using Salon.Api.Domain;

namespace Salon.Api.Domain.Entities;

public sealed class ApplicationUser : IdentityUser<Guid>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public string? AvatarUrl { get; set; }
    public int LoyaltyPoints { get; set; }
    public bool MarketingEmailsOptIn { get; set; }
    public bool SmsOptIn { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? LastSeenAtUtc { get; set; }

    public ICollection<UserAddress> Addresses { get; set; } = new List<UserAddress>();
    public ICollection<FavoriteService> FavoriteServices { get; set; } = new List<FavoriteService>();
    public ICollection<SavedLook> SavedLooks { get; set; } = new List<SavedLook>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<MembershipSubscription> MembershipSubscriptions { get; set; } = new List<MembershipSubscription>();
    public ICollection<LoyaltyTransaction> LoyaltyTransactions { get; set; } = new List<LoyaltyTransaction>();
}

public sealed class ApplicationRole : IdentityRole<Guid>
{
    public string? Description { get; set; }
}

public sealed class UserAddress : AuditableEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public string Label { get; set; } = "Home";
    public string RecipientName { get; set; } = string.Empty;
    public string Line1 { get; set; } = string.Empty;
    public string? Line2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string CountryCode { get; set; } = "US";
    public bool IsDefault { get; set; }
}

public sealed class FavoriteService : AuditableEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public Guid ServiceId { get; set; }
    public SalonService Service { get; set; } = null!;
}

public sealed class SavedLook : AuditableEntity
{
    public Guid UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public string ImageUrl { get; set; } = string.Empty;
    public string? Caption { get; set; }
    public string? SourceUrl { get; set; }
}
