using System.ComponentModel.DataAnnotations;
using Salon.Api.Domain;

namespace Salon.Api.DTOs;

public sealed record ProductCardDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    string Name,
    string Slug,
    string Sku,
    string ShortDescription,
    decimal Price,
    decimal? CompareAtPrice,
    bool InStock,
    string? PrimaryImageUrl,
    bool IsFeatured);

public sealed record ProductDetailDto(
    Guid Id,
    Guid CategoryId,
    string CategoryName,
    string Name,
    string Slug,
    string Sku,
    string ShortDescription,
    string? Description,
    decimal Price,
    decimal? CompareAtPrice,
    int StockQuantity,
    string? PrimaryImageUrl,
    IReadOnlyCollection<string> Images,
    IReadOnlyCollection<ProductCardDto> RelatedProducts);

public sealed class CheckoutItemRequest
{
    [Required]
    public Guid ProductId { get; init; }

    [Range(1, 20)]
    public int Quantity { get; init; }
}

public sealed class CheckoutCustomerRequest
{
    [Required, StringLength(80)]
    public string FirstName { get; init; } = string.Empty;

    [Required, StringLength(80)]
    public string LastName { get; init; } = string.Empty;

    [Required, EmailAddress, StringLength(256)]
    public string Email { get; init; } = string.Empty;

    [Required, Phone, StringLength(40)]
    public string Phone { get; init; } = string.Empty;
}

public sealed class ShippingAddressRequest
{
    [Required, StringLength(200)]
    public string Line1 { get; init; } = string.Empty;

    [StringLength(200)]
    public string? Line2 { get; init; }

    [Required, StringLength(100)]
    public string City { get; init; } = string.Empty;

    [Required, StringLength(100)]
    public string State { get; init; } = string.Empty;

    [Required, StringLength(20)]
    public string PostalCode { get; init; } = string.Empty;

    [Required, StringLength(2, MinimumLength = 2)]
    public string CountryCode { get; init; } = "US";
}

public sealed class CheckoutRequest
{
    [Required, MinLength(1)]
    public IReadOnlyCollection<CheckoutItemRequest> Items { get; init; } = Array.Empty<CheckoutItemRequest>();

    [Required]
    public CheckoutCustomerRequest Customer { get; init; } = new();

    public ShippingAddressRequest? ShippingAddress { get; init; }

    [Required, RegularExpression("Pickup|Shipping", ErrorMessage = "FulfillmentMethod must be Pickup or Shipping.")]
    public string FulfillmentMethod { get; init; } = "Pickup";

    [StringLength(40)]
    public string? CouponCode { get; init; }

    [StringLength(120)]
    public string? PaymentMethodId { get; init; }
}

public sealed record OrderResponse(
    Guid Id,
    string Number,
    OrderStatus Status,
    PaymentStatus PaymentStatus,
    decimal Subtotal,
    decimal DiscountAmount,
    decimal ShippingAmount,
    decimal TaxAmount,
    decimal Total,
    DateTime CreatedAtUtc,
    IReadOnlyCollection<OrderLineDto> Items);

public sealed record OrderLineDto(
    Guid? ProductId,
    string ProductName,
    string Sku,
    int Quantity,
    decimal UnitPrice);
