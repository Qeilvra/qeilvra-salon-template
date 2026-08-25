using Salon.Api.Domain;

namespace Salon.Api.Domain.Entities;

public sealed class Appointment : AuditableEntity
{
    public string Number { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public ApplicationUser? Customer { get; set; }
    public Guid StaffId { get; set; }
    public StaffMember Staff { get; set; } = null!;
    public Guid? CouponId { get; set; }
    public Coupon? Coupon { get; set; }
    public string GuestFirstName { get; set; } = string.Empty;
    public string GuestLastName { get; set; } = string.Empty;
    public string GuestEmail { get; set; } = string.Empty;
    public string GuestPhone { get; set; } = string.Empty;
    public DateTime StartsAtUtc { get; set; }
    public DateTime EndsAtUtc { get; set; }
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal DepositAmount { get; set; }
    public decimal Total { get; set; }
    public string? Notes { get; set; }
    public string? CancellationReason { get; set; }
    public DateTime? CancelledAtUtc { get; set; }
    public string? StripePaymentIntentId { get; set; }

    public ICollection<AppointmentItem> Items { get; set; } = new List<AppointmentItem>();
    public Review? Review { get; set; }
}

public sealed class AppointmentItem : AuditableEntity
{
    public Guid AppointmentId { get; set; }
    public Appointment Appointment { get; set; } = null!;
    public Guid? ServiceId { get; set; }
    public SalonService? Service { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal UnitPrice { get; set; }

    public ICollection<AppointmentItemAddOn> AddOns { get; set; } = new List<AppointmentItemAddOn>();
}

public sealed class AppointmentItemAddOn : AuditableEntity
{
    public Guid AppointmentItemId { get; set; }
    public AppointmentItem AppointmentItem { get; set; } = null!;
    public Guid? AddOnId { get; set; }
    public AddOn? AddOn { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }
}

public sealed class Review : AuditableEntity
{
    public Guid? AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }
    public Guid? CustomerId { get; set; }
    public ApplicationUser? Customer { get; set; }
    public Guid? ServiceId { get; set; }
    public SalonService? Service { get; set; }
    public Guid? StaffId { get; set; }
    public StaffMember? Staff { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Comment { get; set; } = string.Empty;
    public ReviewStatus Status { get; set; } = ReviewStatus.Pending;
    public bool IsFeatured { get; set; }
    public DateTime? PublishedAtUtc { get; set; }
}
