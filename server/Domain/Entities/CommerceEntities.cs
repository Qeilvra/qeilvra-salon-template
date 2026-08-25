using Salon.Api.Domain;

namespace Salon.Api.Domain.Entities;

public sealed class ProductCategory : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

public sealed class Product : AuditableEntity
{
    public Guid CategoryId { get; set; }
    public ProductCategory Category { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public int StockQuantity { get; set; }
    public bool TrackInventory { get; set; } = true;
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;
    public string? PrimaryImageUrl { get; set; }
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}

public sealed class ProductImage : AuditableEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int SortOrder { get; set; }
}

public sealed class ShoppingCart : AuditableEntity
{
    public Guid? CustomerId { get; set; }
    public ApplicationUser? Customer { get; set; }
    public string? GuestToken { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}

public sealed class CartItem : AuditableEntity
{
    public Guid CartId { get; set; }
    public ShoppingCart Cart { get; set; } = null!;
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int Quantity { get; set; }
}

public sealed class Order : AuditableEntity
{
    public string Number { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public ApplicationUser? Customer { get; set; }
    public Guid? CouponId { get; set; }
    public Coupon? Coupon { get; set; }
    public string CustomerFirstName { get; set; } = string.Empty;
    public string CustomerLastName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string CountryCode { get; set; } = "US";
    public string FulfillmentMethod { get; set; } = "Pickup";
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal Total { get; set; }
    public string? StripePaymentIntentId { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public sealed class OrderItem : AuditableEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public Guid? ProductId { get; set; }
    public Product? Product { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public sealed class MembershipPlan : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal MonthlyPrice { get; set; }
    public int MonthlyCredits { get; set; }
    public decimal ServiceDiscountPercent { get; set; }
    public bool IsActive { get; set; } = true;
    public string? BenefitsJson { get; set; }
    public ICollection<MembershipSubscription> Subscriptions { get; set; } = new List<MembershipSubscription>();
}

public sealed class MembershipSubscription : AuditableEntity
{
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    public Guid PlanId { get; set; }
    public MembershipPlan Plan { get; set; } = null!;
    public MembershipStatus Status { get; set; } = MembershipStatus.Active;
    public DateTime StartsAtUtc { get; set; }
    public DateTime? RenewsAtUtc { get; set; }
    public DateTime? EndsAtUtc { get; set; }
    public string? StripeSubscriptionId { get; set; }
}

public sealed class LoyaltyTransaction : AuditableEntity
{
    public Guid CustomerId { get; set; }
    public ApplicationUser Customer { get; set; } = null!;
    public LoyaltyTransactionType Type { get; set; }
    public int Points { get; set; }
    public int BalanceAfter { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid? AppointmentId { get; set; }
    public Guid? OrderId { get; set; }
    public DateTime? ExpiresAtUtc { get; set; }
}

public sealed class GiftCard : AuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public string PinHash { get; set; } = string.Empty;
    public Guid? PurchaserId { get; set; }
    public ApplicationUser? Purchaser { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public string RecipientEmail { get; set; } = string.Empty;
    public string? PersonalMessage { get; set; }
    public decimal InitialValue { get; set; }
    public decimal Balance { get; set; }
    public GiftCardStatus Status { get; set; } = GiftCardStatus.Active;
    public DateTime? ExpiresAtUtc { get; set; }
    public ICollection<GiftCardTransaction> Transactions { get; set; } = new List<GiftCardTransaction>();
}

public sealed class GiftCardTransaction : AuditableEntity
{
    public Guid GiftCardId { get; set; }
    public GiftCard GiftCard { get; set; } = null!;
    public decimal Amount { get; set; }
    public decimal BalanceAfter { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid? AppointmentId { get; set; }
    public Guid? OrderId { get; set; }
}

public sealed class Coupon : AuditableEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MinimumSpend { get; set; }
    public decimal? MaximumDiscount { get; set; }
    public DateTime StartsAtUtc { get; set; }
    public DateTime EndsAtUtc { get; set; }
    public int? UsageLimit { get; set; }
    public int UsageCount { get; set; }
    public bool AppliesToServices { get; set; } = true;
    public bool AppliesToProducts { get; set; } = true;
    public bool IsActive { get; set; } = true;
}
