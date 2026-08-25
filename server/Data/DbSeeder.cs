using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Domain;
using Salon.Api.Domain.Entities;

namespace Salon.Api.Data;

public static class DbSeeder
{
    public static async Task InitializeAsync(
        IServiceProvider serviceProvider,
        bool initializeDatabase,
        bool seedDemoData,
        CancellationToken cancellationToken = default)
    {
        if (!initializeDatabase && !seedDemoData)
        {
            return;
        }

        await using var scope = serviceProvider.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<SalonDbContext>();

        if (initializeDatabase)
        {
            await db.Database.EnsureCreatedAsync(cancellationToken);
        }

        if (!seedDemoData)
        {
            return;
        }

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        await SeedRolesAndUsersAsync(roleManager, userManager);

        if (await db.ServiceCategories.AnyAsync(cancellationToken))
        {
            return;
        }

        var manicure = new ServiceCategory
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
            Name = "Manicures",
            Slug = "manicures",
            Description = "Signature care for polished, healthy hands.",
            SortOrder = 1,
            ImageUrl = "/images/services/manicure.jpg"
        };
        var pedicure = new ServiceCategory
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
            Name = "Pedicures",
            Slug = "pedicures",
            Description = "Restorative foot rituals and immaculate color.",
            SortOrder = 2,
            ImageUrl = "/images/services/pedicure.jpg"
        };
        var enhancements = new ServiceCategory
        {
            Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
            Name = "Enhancements & Art",
            Slug = "enhancements-and-art",
            Description = "Sculpted sets, extensions, and bespoke nail art.",
            SortOrder = 3,
            ImageUrl = "/images/services/nail-art.jpg"
        };

        var signatureManicure = new SalonService
        {
            Id = Guid.Parse("20000000-0000-0000-0000-000000000001"),
            Category = manicure,
            Name = "Maison Signature Manicure",
            Slug = "maison-signature-manicure",
            Summary = "Detailed cuticle care, shaping, massage, and long-wear polish.",
            Description = "A meticulous ritual with botanical soak, detailed grooming, hydrating massage, and the polish of your choice.",
            DurationMinutes = 45,
            Price = 48m,
            DepositAmount = 15m,
            IsFeatured = true,
            SortOrder = 1,
            ImageUrl = "/images/services/signature-manicure.jpg"
        };
        var gelManicure = new SalonService
        {
            Id = Guid.Parse("20000000-0000-0000-0000-000000000002"),
            Category = manicure,
            Name = "Luxe Gel Manicure",
            Slug = "luxe-gel-manicure",
            Summary = "A flawless, high-shine gel finish designed to last.",
            DurationMinutes = 60,
            Price = 65m,
            DepositAmount = 20m,
            IsFeatured = true,
            SortOrder = 2,
            ImageUrl = "/images/services/gel-manicure.jpg"
        };
        var spaPedicure = new SalonService
        {
            Id = Guid.Parse("20000000-0000-0000-0000-000000000003"),
            Category = pedicure,
            Name = "Rose Quartz Spa Pedicure",
            Slug = "rose-quartz-spa-pedicure",
            Summary = "An indulgent soak, exfoliation, mask, massage, and polish.",
            DurationMinutes = 75,
            Price = 85m,
            DepositAmount = 25m,
            IsFeatured = true,
            SortOrder = 1,
            ImageUrl = "/images/services/spa-pedicure.jpg"
        };
        var extensions = new SalonService
        {
            Id = Guid.Parse("20000000-0000-0000-0000-000000000004"),
            Category = enhancements,
            Name = "Sculpted Gel Extensions",
            Slug = "sculpted-gel-extensions",
            Summary = "Lightweight custom-shaped extensions with one-color gel.",
            DurationMinutes = 105,
            Price = 115m,
            DepositAmount = 35m,
            IsFeatured = true,
            SortOrder = 1,
            ImageUrl = "/images/services/gel-extensions.jpg"
        };

        var french = new AddOn
        {
            Id = Guid.Parse("30000000-0000-0000-0000-000000000001"),
            Name = "Modern French Finish",
            Slug = "modern-french-finish",
            Description = "Classic, micro, or colored French tips.",
            DurationMinutes = 15,
            Price = 15m
        };
        var art = new AddOn
        {
            Id = Guid.Parse("30000000-0000-0000-0000-000000000002"),
            Name = "Signature Nail Art",
            Slug = "signature-nail-art",
            Description = "Hand-painted detail on up to four nails.",
            DurationMinutes = 20,
            Price = 22m
        };
        var removal = new AddOn
        {
            Id = Guid.Parse("30000000-0000-0000-0000-000000000003"),
            Name = "Gel Removal",
            Slug = "gel-removal",
            Description = "Gentle removal of existing gel product.",
            DurationMinutes = 15,
            Price = 12m
        };

        db.ServiceCategories.AddRange(manicure, pedicure, enhancements);
        db.Services.AddRange(signatureManicure, gelManicure, spaPedicure, extensions);
        db.AddOns.AddRange(french, art, removal);
        db.ServiceAddOns.AddRange(
            new ServiceAddOn { Service = signatureManicure, AddOn = french },
            new ServiceAddOn { Service = signatureManicure, AddOn = art },
            new ServiceAddOn { Service = gelManicure, AddOn = french },
            new ServiceAddOn { Service = gelManicure, AddOn = art },
            new ServiceAddOn { Service = gelManicure, AddOn = removal },
            new ServiceAddOn { Service = extensions, AddOn = french },
            new ServiceAddOn { Service = extensions, AddOn = art },
            new ServiceAddOn { Service = extensions, AddOn = removal });

        var artists = new[]
        {
            new StaffMember
            {
                Id = Guid.Parse("40000000-0000-0000-0000-000000000001"),
                DisplayName = "Amelia Rose",
                Slug = "amelia-rose",
                JobTitle = "Lead Nail Artist",
                Bio = "Known for editorial nail art, impeccable structure, and a warm, considered guest experience.",
                YearsExperience = 9,
                Rating = 4.9m,
                ReviewCount = 124,
                IsFeatured = true,
                ImageUrl = "/images/team/amelia.jpg"
            },
            new StaffMember
            {
                Id = Guid.Parse("40000000-0000-0000-0000-000000000002"),
                DisplayName = "Sofia Lane",
                Slug = "sofia-lane",
                JobTitle = "Senior Nail Technician",
                Bio = "A natural-nail specialist celebrated for refined minimal designs and restorative care.",
                YearsExperience = 7,
                Rating = 4.8m,
                ReviewCount = 98,
                IsFeatured = true,
                ImageUrl = "/images/team/sofia.jpg"
            },
            new StaffMember
            {
                Id = Guid.Parse("40000000-0000-0000-0000-000000000003"),
                DisplayName = "Maya Chen",
                Slug = "maya-chen",
                JobTitle = "Nail Artist",
                Bio = "Maya blends modern color theory with precise hand-painted details.",
                YearsExperience = 5,
                Rating = 4.9m,
                ReviewCount = 76,
                IsFeatured = true,
                ImageUrl = "/images/team/maya.jpg"
            }
        };
        db.StaffMembers.AddRange(artists);

        foreach (var artist in artists)
        {
            foreach (var service in new[] { signatureManicure, gelManicure, spaPedicure, extensions })
            {
                db.StaffServices.Add(new StaffService { Staff = artist, Service = service });
            }

            foreach (var day in new[]
                     {
                         DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday,
                         DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday
                     })
            {
                db.StaffAvailability.Add(new StaffAvailability
                {
                    Staff = artist,
                    DayOfWeek = day,
                    StartTime = day == DayOfWeek.Saturday ? new TimeOnly(9, 0) : new TimeOnly(10, 0),
                    EndTime = day == DayOfWeek.Saturday ? new TimeOnly(17, 0) : new TimeOnly(19, 0)
                });
            }
        }

        var productCategory = new ProductCategory
        {
            Id = Guid.Parse("50000000-0000-0000-0000-000000000001"),
            Name = "Nail Care",
            Slug = "nail-care",
            Description = "Salon-grade essentials selected by our artists."
        };
        db.ProductCategories.Add(productCategory);
        db.Products.AddRange(
            new Product
            {
                Id = Guid.Parse("51000000-0000-0000-0000-000000000001"),
                Category = productCategory,
                Name = "Velvet Cuticle Elixir",
                Slug = "velvet-cuticle-elixir",
                Sku = "MNS-ELIXIR-15",
                ShortDescription = "A fast-absorbing botanical oil for conditioned cuticles.",
                Price = 28m,
                StockQuantity = 40,
                IsFeatured = true,
                PrimaryImageUrl = "/images/shop/cuticle-elixir.jpg"
            },
            new Product
            {
                Id = Guid.Parse("51000000-0000-0000-0000-000000000002"),
                Category = productCategory,
                Name = "Cashmere Hand Crème",
                Slug = "cashmere-hand-creme",
                Sku = "MNS-CREME-50",
                ShortDescription = "Rich hydration with a soft rose and sandalwood finish.",
                Price = 34m,
                CompareAtPrice = 38m,
                StockQuantity = 28,
                IsFeatured = true,
                PrimaryImageUrl = "/images/shop/hand-creme.jpg"
            });

        db.MembershipPlans.AddRange(
            new MembershipPlan
            {
                Id = Guid.Parse("60000000-0000-0000-0000-000000000001"),
                Name = "The Essential",
                Slug = "the-essential",
                Description = "One signature manicure credit each month plus member pricing.",
                MonthlyPrice = 49m,
                MonthlyCredits = 1,
                ServiceDiscountPercent = 10m,
                BenefitsJson = "[\"1 monthly service credit\",\"10% off additional services\",\"Priority booking\"]"
            },
            new MembershipPlan
            {
                Id = Guid.Parse("60000000-0000-0000-0000-000000000002"),
                Name = "The Icon",
                Slug = "the-icon",
                Description = "Two monthly credits, preferred booking, and elevated rewards.",
                MonthlyPrice = 95m,
                MonthlyCredits = 2,
                ServiceDiscountPercent = 15m,
                BenefitsJson = "[\"2 monthly service credits\",\"15% off additional services\",\"Complimentary birthday add-on\"]"
            });

        db.Coupons.Add(new Coupon
        {
            Id = Guid.Parse("70000000-0000-0000-0000-000000000001"),
            Code = "WELCOME20",
            Name = "First Visit",
            Description = "Twenty percent off a first qualifying visit.",
            DiscountType = DiscountType.Percentage,
            DiscountValue = 20m,
            MaximumDiscount = 30m,
            StartsAtUtc = DateTime.UtcNow.AddDays(-30),
            EndsAtUtc = DateTime.UtcNow.AddYears(1),
            AppliesToServices = true,
            AppliesToProducts = false
        });

        db.BlogPosts.AddRange(
            new BlogPost
            {
                Id = Guid.Parse("80000000-0000-0000-0000-000000000001"),
                Title = "How to Make Your Manicure Last Longer",
                Slug = "how-to-make-your-manicure-last-longer",
                Excerpt = "Simple habits our artists recommend for a glossy, chip-resistant finish.",
                ContentHtml = "<p>Beautiful retention begins with daily cuticle oil, gloves for household work, and treating your nails as jewels—not tools.</p>",
                AuthorName = "Maison Editorial",
                HeroImageUrl = "/images/blog/manicure-care.jpg",
                IsPublished = true,
                PublishedAtUtc = DateTime.UtcNow.AddDays(-14)
            },
            new BlogPost
            {
                Id = Guid.Parse("80000000-0000-0000-0000-000000000002"),
                Title = "The Bridal Nail Timeline",
                Slug = "the-bridal-nail-timeline",
                Excerpt = "A calm, considered schedule for trials, treatments, and wedding-week color.",
                ContentHtml = "<p>Begin strengthening treatments six to eight weeks ahead, reserve a trial, and schedule your final appointment one or two days before the ceremony.</p>",
                AuthorName = "Maison Editorial",
                HeroImageUrl = "/images/blog/bridal-nails.jpg",
                IsPublished = true,
                PublishedAtUtc = DateTime.UtcNow.AddDays(-28)
            });

        db.GalleryImages.AddRange(
            new GalleryImage { ImageUrl = "/images/gallery/soft-french.jpg", AltText = "Soft almond French manicure", Category = "Minimal", SortOrder = 1 },
            new GalleryImage { ImageUrl = "/images/gallery/rose-gold.jpg", AltText = "Rose gold detailed nail art", Category = "Nail Art", SortOrder = 2 },
            new GalleryImage { ImageUrl = "/images/gallery/bridal-pearl.jpg", AltText = "Pearl bridal manicure", Category = "Bridal", SortOrder = 3 });

        db.Reviews.AddRange(
            new Review
            {
                DisplayName = "Olivia M.",
                Rating = 5,
                Title = "The most thoughtful salon experience",
                Comment = "Every detail felt considered, and my manicure was immaculate for weeks.",
                Status = ReviewStatus.Approved,
                IsFeatured = true,
                Staff = artists[0],
                Service = gelManicure,
                PublishedAtUtc = DateTime.UtcNow.AddDays(-9)
            },
            new Review
            {
                DisplayName = "Camille R.",
                Rating = 5,
                Title = "Beautiful work and a serene space",
                Comment = "Sofia understood exactly the understated look I wanted. Booking was effortless.",
                Status = ReviewStatus.Approved,
                IsFeatured = true,
                Staff = artists[1],
                Service = signatureManicure,
                PublishedAtUtc = DateTime.UtcNow.AddDays(-18)
            });

        await db.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedRolesAndUsersAsync(
        RoleManager<ApplicationRole> roleManager,
        UserManager<ApplicationUser> userManager)
    {
        var roles = new Dictionary<string, string>
        {
            ["Admin"] = "Full business and platform administration.",
            ["Manager"] = "Salon operations, reports, content, and schedules.",
            ["Staff"] = "Assigned appointments and personal availability.",
            ["Customer"] = "Customer account and booking access."
        };

        foreach (var (name, description) in roles)
        {
            if (!await roleManager.RoleExistsAsync(name))
            {
                await roleManager.CreateAsync(new ApplicationRole { Name = name, Description = description });
            }
        }

        await EnsureUserAsync(
            userManager,
            "admin@maisonnails.example",
            "Maison",
            "Admin",
            "ChangeMe123!",
            "Admin");

        await EnsureUserAsync(
            userManager,
            "guest@maisonnails.example",
            "Avery",
            "Guest",
            "ChangeMe123!",
            "Customer");
    }

    private static async Task EnsureUserAsync(
        UserManager<ApplicationUser> userManager,
        string email,
        string firstName,
        string lastName,
        string password,
        string role)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
        {
            user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                FirstName = firstName,
                LastName = lastName,
                LoyaltyPoints = role == "Customer" ? 250 : 0
            };

            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException(
                    $"Unable to create demo user {email}: {string.Join(", ", result.Errors.Select(error => error.Description))}");
            }
        }

        if (!await userManager.IsInRoleAsync(user, role))
        {
            await userManager.AddToRoleAsync(user, role);
        }
    }
}
