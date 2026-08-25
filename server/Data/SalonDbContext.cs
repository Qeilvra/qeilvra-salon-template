using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Domain;
using Salon.Api.Domain.Entities;

namespace Salon.Api.Data;

public sealed class SalonDbContext
    : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public SalonDbContext(DbContextOptions<SalonDbContext> options) : base(options)
    {
    }

    public DbSet<UserAddress> UserAddresses => Set<UserAddress>();
    public DbSet<FavoriteService> FavoriteServices => Set<FavoriteService>();
    public DbSet<SavedLook> SavedLooks => Set<SavedLook>();
    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
    public DbSet<SalonService> Services => Set<SalonService>();
    public DbSet<AddOn> AddOns => Set<AddOn>();
    public DbSet<ServiceAddOn> ServiceAddOns => Set<ServiceAddOn>();
    public DbSet<StaffMember> StaffMembers => Set<StaffMember>();
    public DbSet<StaffService> StaffServices => Set<StaffService>();
    public DbSet<StaffAvailability> StaffAvailability => Set<StaffAvailability>();
    public DbSet<StaffTimeOff> StaffTimeOff => Set<StaffTimeOff>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<AppointmentItem> AppointmentItems => Set<AppointmentItem>();
    public DbSet<AppointmentItemAddOn> AppointmentItemAddOns => Set<AppointmentItemAddOn>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ShoppingCart> ShoppingCarts => Set<ShoppingCart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<MembershipPlan> MembershipPlans => Set<MembershipPlan>();
    public DbSet<MembershipSubscription> MembershipSubscriptions => Set<MembershipSubscription>();
    public DbSet<LoyaltyTransaction> LoyaltyTransactions => Set<LoyaltyTransaction>();
    public DbSet<GiftCard> GiftCards => Set<GiftCard>();
    public DbSet<GiftCardTransaction> GiftCardTransactions => Set<GiftCardTransaction>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<ContentPage> ContentPages => Set<ContentPage>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();
    public DbSet<ContactInquiry> ContactInquiries => Set<ContactInquiry>();
    public DbSet<NewsletterSubscriber> NewsletterSubscribers => Set<NewsletterSubscriber>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        ConfigureIdentity(builder);
        ConfigureCatalog(builder);
        ConfigureBookings(builder);
        ConfigureCommerce(builder);
        ConfigureEngagement(builder);

        foreach (var property in builder.Model.GetEntityTypes()
                     .SelectMany(entity => entity.GetProperties())
                     .Where(property => property.ClrType == typeof(decimal) ||
                                        property.ClrType == typeof(decimal?)))
        {
            property.SetPrecision(18);
            property.SetScale(2);
        }
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        ApplyAuditFields();
        return base.SaveChanges();
    }

    private void ApplyAuditFields()
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAtUtc = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAtUtc = now;
            }
        }
    }

    private static void ConfigureIdentity(ModelBuilder builder)
    {
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(x => x.FirstName).HasMaxLength(80);
            entity.Property(x => x.LastName).HasMaxLength(80);
            entity.Property(x => x.AvatarUrl).HasMaxLength(500);
        });

        builder.Entity<ApplicationRole>()
            .Property(x => x.Description)
            .HasMaxLength(250);

        builder.Entity<UserAddress>(entity =>
        {
            entity.Property(x => x.Label).HasMaxLength(40);
            entity.Property(x => x.RecipientName).HasMaxLength(160);
            entity.Property(x => x.Line1).HasMaxLength(200);
            entity.Property(x => x.Line2).HasMaxLength(200);
            entity.Property(x => x.City).HasMaxLength(100);
            entity.Property(x => x.State).HasMaxLength(100);
            entity.Property(x => x.PostalCode).HasMaxLength(20);
            entity.Property(x => x.CountryCode).HasMaxLength(2);
            entity.HasIndex(x => new { x.UserId, x.IsDefault });
        });

        builder.Entity<FavoriteService>(entity =>
        {
            entity.HasIndex(x => new { x.UserId, x.ServiceId }).IsUnique();
            entity.HasOne(x => x.Service).WithMany().OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<SavedLook>(entity =>
        {
            entity.Property(x => x.ImageUrl).HasMaxLength(500);
            entity.Property(x => x.Caption).HasMaxLength(250);
            entity.Property(x => x.SourceUrl).HasMaxLength(500);
        });
    }

    private static void ConfigureCatalog(ModelBuilder builder)
    {
        builder.Entity<ServiceCategory>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(140).IsRequired();
            entity.Property(x => x.ImageUrl).HasMaxLength(500);
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        builder.Entity<SalonService>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Summary).HasMaxLength(500);
            entity.Property(x => x.ImageUrl).HasMaxLength(500);
            entity.HasIndex(x => x.Slug).IsUnique();
            entity.HasIndex(x => new { x.CategoryId, x.IsActive, x.SortOrder });
            entity.HasOne(x => x.Category).WithMany(x => x.Services).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<AddOn>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(140).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(160).IsRequired();
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        builder.Entity<ServiceAddOn>(entity =>
        {
            entity.HasKey(x => new { x.ServiceId, x.AddOnId });
            entity.HasOne(x => x.Service).WithMany(x => x.ServiceAddOns).HasForeignKey(x => x.ServiceId);
            entity.HasOne(x => x.AddOn).WithMany(x => x.ServiceAddOns).HasForeignKey(x => x.AddOnId);
        });

        builder.Entity<StaffMember>(entity =>
        {
            entity.Property(x => x.DisplayName).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(180).IsRequired();
            entity.Property(x => x.JobTitle).HasMaxLength(120);
            entity.Property(x => x.ImageUrl).HasMaxLength(500);
            entity.HasIndex(x => x.Slug).IsUnique();
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<StaffService>(entity =>
        {
            entity.HasKey(x => new { x.StaffId, x.ServiceId });
            entity.HasOne(x => x.Staff).WithMany(x => x.StaffServices).HasForeignKey(x => x.StaffId);
            entity.HasOne(x => x.Service).WithMany(x => x.StaffServices).HasForeignKey(x => x.ServiceId);
        });

        builder.Entity<StaffAvailability>(entity =>
        {
            entity.HasIndex(x => new { x.StaffId, x.DayOfWeek, x.IsActive });
            entity.HasOne(x => x.Staff).WithMany(x => x.Availability).HasForeignKey(x => x.StaffId);
        });

        builder.Entity<StaffTimeOff>(entity =>
        {
            entity.Property(x => x.Reason).HasMaxLength(250);
            entity.HasIndex(x => new { x.StaffId, x.StartsAtUtc, x.EndsAtUtc });
            entity.HasOne(x => x.Staff).WithMany(x => x.TimeOff).HasForeignKey(x => x.StaffId).OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureBookings(ModelBuilder builder)
    {
        builder.Entity<Appointment>(entity =>
        {
            entity.Property(x => x.Number).HasMaxLength(24).IsRequired();
            entity.Property(x => x.GuestFirstName).HasMaxLength(80).IsRequired();
            entity.Property(x => x.GuestLastName).HasMaxLength(80).IsRequired();
            entity.Property(x => x.GuestEmail).HasMaxLength(256).IsRequired();
            entity.Property(x => x.GuestPhone).HasMaxLength(40).IsRequired();
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
            entity.Property(x => x.PaymentStatus).HasConversion<string>().HasMaxLength(30);
            entity.Property(x => x.StripePaymentIntentId).HasMaxLength(120);
            entity.HasIndex(x => x.Number).IsUnique();
            entity.HasIndex(x => new { x.StaffId, x.StartsAtUtc, x.EndsAtUtc });
            entity.HasIndex(x => new { x.CustomerId, x.StartsAtUtc });
            entity.HasOne(x => x.Customer).WithMany(x => x.Appointments).HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Staff).WithMany().HasForeignKey(x => x.StaffId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Coupon).WithMany().HasForeignKey(x => x.CouponId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<AppointmentItem>(entity =>
        {
            entity.Property(x => x.ServiceName).HasMaxLength(160).IsRequired();
            entity.HasOne(x => x.Appointment).WithMany(x => x.Items).HasForeignKey(x => x.AppointmentId);
            entity.HasOne(x => x.Service).WithMany().HasForeignKey(x => x.ServiceId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<AppointmentItemAddOn>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(140).IsRequired();
            entity.HasOne(x => x.AppointmentItem).WithMany(x => x.AddOns).HasForeignKey(x => x.AppointmentItemId);
            entity.HasOne(x => x.AddOn).WithMany().HasForeignKey(x => x.AddOnId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Review>(entity =>
        {
            entity.Property(x => x.DisplayName).HasMaxLength(160).IsRequired();
            entity.Property(x => x.Title).HasMaxLength(180);
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
            entity.HasIndex(x => new { x.Status, x.PublishedAtUtc });
            entity.HasIndex(x => x.AppointmentId).IsUnique().HasFilter("[AppointmentId] IS NOT NULL");
            entity.HasOne(x => x.Appointment).WithOne(x => x.Review).HasForeignKey<Review>(x => x.AppointmentId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(x => x.Service).WithMany().HasForeignKey(x => x.ServiceId).OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(x => x.Staff).WithMany().HasForeignKey(x => x.StaffId).OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigureCommerce(ModelBuilder builder)
    {
        builder.Entity<ProductCategory>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(140).IsRequired();
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        builder.Entity<Product>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(200).IsRequired();
            entity.Property(x => x.Sku).HasMaxLength(80).IsRequired();
            entity.Property(x => x.ShortDescription).HasMaxLength(500);
            entity.Property(x => x.PrimaryImageUrl).HasMaxLength(500);
            entity.HasIndex(x => x.Slug).IsUnique();
            entity.HasIndex(x => x.Sku).IsUnique();
            entity.HasOne(x => x.Category).WithMany(x => x.Products).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<ProductImage>(entity =>
        {
            entity.Property(x => x.Url).HasMaxLength(500).IsRequired();
            entity.Property(x => x.AltText).HasMaxLength(250);
        });

        builder.Entity<ShoppingCart>(entity =>
        {
            entity.Property(x => x.GuestToken).HasMaxLength(100);
            entity.HasIndex(x => x.CustomerId).IsUnique().HasFilter("[CustomerId] IS NOT NULL");
            entity.HasIndex(x => x.GuestToken).IsUnique().HasFilter("[GuestToken] IS NOT NULL");
            entity.HasOne(x => x.Customer).WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CartItem>(entity =>
        {
            entity.HasIndex(x => new { x.CartId, x.ProductId }).IsUnique();
            entity.HasOne(x => x.Cart).WithMany(x => x.Items).HasForeignKey(x => x.CartId);
            entity.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<Order>(entity =>
        {
            entity.Property(x => x.Number).HasMaxLength(24).IsRequired();
            entity.Property(x => x.CustomerEmail).HasMaxLength(256);
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
            entity.Property(x => x.PaymentStatus).HasConversion<string>().HasMaxLength(30);
            entity.Property(x => x.StripePaymentIntentId).HasMaxLength(120);
            entity.HasIndex(x => x.Number).IsUnique();
            entity.HasIndex(x => new { x.CustomerId, x.CreatedAtUtc });
            entity.HasOne(x => x.Customer).WithMany(x => x.Orders).HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Coupon).WithMany().HasForeignKey(x => x.CouponId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<OrderItem>(entity =>
        {
            entity.Property(x => x.ProductName).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Sku).HasMaxLength(80).IsRequired();
            entity.HasOne(x => x.Order).WithMany(x => x.Items).HasForeignKey(x => x.OrderId);
            entity.HasOne(x => x.Product).WithMany().HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<MembershipPlan>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(140).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(160).IsRequired();
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        builder.Entity<MembershipSubscription>(entity =>
        {
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
            entity.HasIndex(x => new { x.CustomerId, x.Status });
            entity.HasOne(x => x.Customer).WithMany(x => x.MembershipSubscriptions).HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Plan).WithMany(x => x.Subscriptions).HasForeignKey(x => x.PlanId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<LoyaltyTransaction>(entity =>
        {
            entity.Property(x => x.Type).HasConversion<string>().HasMaxLength(30);
            entity.Property(x => x.Description).HasMaxLength(250);
            entity.HasIndex(x => new { x.CustomerId, x.CreatedAtUtc });
            entity.HasOne(x => x.Customer).WithMany(x => x.LoyaltyTransactions).HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<GiftCard>(entity =>
        {
            entity.Property(x => x.Code).HasMaxLength(32).IsRequired();
            entity.Property(x => x.PinHash).HasMaxLength(250).IsRequired();
            entity.Property(x => x.RecipientName).HasMaxLength(160);
            entity.Property(x => x.RecipientEmail).HasMaxLength(256);
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
            entity.HasIndex(x => x.Code).IsUnique();
            entity.HasOne(x => x.Purchaser).WithMany().HasForeignKey(x => x.PurchaserId).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<GiftCardTransaction>(entity =>
        {
            entity.Property(x => x.Description).HasMaxLength(250);
            entity.HasOne(x => x.GiftCard).WithMany(x => x.Transactions).HasForeignKey(x => x.GiftCardId);
        });

        builder.Entity<Coupon>(entity =>
        {
            entity.Property(x => x.Code).HasMaxLength(40).IsRequired();
            entity.Property(x => x.Name).HasMaxLength(140).IsRequired();
            entity.Property(x => x.DiscountType).HasConversion<string>().HasMaxLength(30);
            entity.HasIndex(x => x.Code).IsUnique();
            entity.HasIndex(x => new { x.IsActive, x.StartsAtUtc, x.EndsAtUtc });
        });
    }

    private static void ConfigureEngagement(ModelBuilder builder)
    {
        builder.Entity<BlogPost>(entity =>
        {
            entity.Property(x => x.Title).HasMaxLength(220).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(240).IsRequired();
            entity.Property(x => x.Excerpt).HasMaxLength(600);
            entity.Property(x => x.HeroImageUrl).HasMaxLength(500);
            entity.Property(x => x.AuthorName).HasMaxLength(160);
            entity.HasIndex(x => x.Slug).IsUnique();
            entity.HasIndex(x => new { x.IsPublished, x.PublishedAtUtc });
        });

        builder.Entity<ContentPage>(entity =>
        {
            entity.Property(x => x.Title).HasMaxLength(220).IsRequired();
            entity.Property(x => x.Slug).HasMaxLength(240).IsRequired();
            entity.Property(x => x.MetaTitle).HasMaxLength(200);
            entity.Property(x => x.MetaDescription).HasMaxLength(500);
            entity.HasIndex(x => x.Slug).IsUnique();
        });

        builder.Entity<GalleryImage>(entity =>
        {
            entity.Property(x => x.ImageUrl).HasMaxLength(500).IsRequired();
            entity.Property(x => x.ThumbnailUrl).HasMaxLength(500);
            entity.Property(x => x.AltText).HasMaxLength(250);
            entity.Property(x => x.Category).HasMaxLength(80);
        });

        builder.Entity<ContactInquiry>(entity =>
        {
            entity.Property(x => x.InquiryType).HasMaxLength(80);
            entity.Property(x => x.Email).HasMaxLength(256).IsRequired();
            entity.Property(x => x.Subject).HasMaxLength(200);
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
            entity.HasIndex(x => new { x.Status, x.CreatedAtUtc });
        });

        builder.Entity<NewsletterSubscriber>(entity =>
        {
            entity.Property(x => x.Email).HasMaxLength(256).IsRequired();
            entity.Property(x => x.Source).HasMaxLength(80);
            entity.HasIndex(x => x.Email).IsUnique();
        });
    }
}
