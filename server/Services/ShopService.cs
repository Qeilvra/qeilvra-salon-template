using System.Data;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Data;
using Salon.Api.Domain;
using Salon.Api.Domain.Entities;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;

namespace Salon.Api.Services;

public sealed class ShopService : IShopService
{
    private readonly SalonDbContext _db;
    private readonly IPaymentGateway _payments;
    private readonly TimeProvider _timeProvider;

    public ShopService(SalonDbContext db, IPaymentGateway payments, TimeProvider timeProvider)
    {
        _db = db;
        _payments = payments;
        _timeProvider = timeProvider;
    }

    public async Task<OrderResponse> CheckoutAsync(
        CheckoutRequest request,
        Guid? customerId,
        CancellationToken cancellationToken)
    {
        var requested = request.Items
            .GroupBy(item => item.ProductId)
            .ToDictionary(group => group.Key, group => group.Sum(item => item.Quantity));
        if (requested.Count == 0 || requested.Values.Any(quantity => quantity is < 1 or > 20))
        {
            throw ApiException.BadRequest("The cart contains an invalid quantity.", "invalid_cart");
        }

        if (request.FulfillmentMethod.Equals("Shipping", StringComparison.OrdinalIgnoreCase) &&
            request.ShippingAddress is null)
        {
            throw ApiException.BadRequest("A shipping address is required for delivery orders.", "shipping_address_required");
        }

        var productIds = requested.Keys.ToArray();
        var products = await _db.Products
            .Where(product => productIds.Contains(product.Id) && product.IsActive)
            .ToListAsync(cancellationToken);
        if (products.Count != productIds.Length)
        {
            throw ApiException.BadRequest("One or more products are no longer available.", "product_unavailable");
        }

        foreach (var product in products)
        {
            if (product.TrackInventory && product.StockQuantity < requested[product.Id])
            {
                throw ApiException.Conflict($"Only {product.StockQuantity} of {product.Name} remain in stock.", "insufficient_stock");
            }
        }

        var subtotal = products.Sum(product => product.Price * requested[product.Id]);
        var coupon = await FindCouponAsync(request.CouponCode, subtotal, cancellationToken);
        var discount = CalculateDiscount(coupon, subtotal);
        var shipping = request.FulfillmentMethod.Equals("Shipping", StringComparison.OrdinalIgnoreCase) &&
                       subtotal - discount < 75m
            ? 8m
            : 0m;
        var tax = Math.Round((subtotal - discount) * 0.0825m, 2, MidpointRounding.AwayFromZero);
        var total = subtotal - discount + shipping + tax;

        var reference = CreateReference();
        var payment = await _payments.CreateIntentAsync(
            total,
            $"Product order {reference}",
            request.PaymentMethodId,
            new Dictionary<string, string>
            {
                ["orderNumber"] = reference,
                ["customerEmail"] = request.Customer.Email
            },
            cancellationToken);

        await using var transaction = await _db.Database.BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);
        foreach (var product in products)
        {
            await _db.Entry(product).ReloadAsync(cancellationToken);
            if (!product.IsActive || (product.TrackInventory && product.StockQuantity < requested[product.Id]))
            {
                throw ApiException.Conflict($"{product.Name} became unavailable during checkout.", "insufficient_stock");
            }

            if (product.TrackInventory)
            {
                product.StockQuantity -= requested[product.Id];
            }
        }

        var address = request.ShippingAddress;
        var order = new Order
        {
            Number = reference,
            CustomerId = customerId,
            CouponId = coupon?.Id,
            CustomerFirstName = request.Customer.FirstName.Trim(),
            CustomerLastName = request.Customer.LastName.Trim(),
            CustomerEmail = request.Customer.Email.Trim().ToLowerInvariant(),
            CustomerPhone = request.Customer.Phone.Trim(),
            AddressLine1 = address?.Line1.Trim() ?? string.Empty,
            AddressLine2 = address?.Line2?.Trim(),
            City = address?.City.Trim() ?? string.Empty,
            State = address?.State.Trim() ?? string.Empty,
            PostalCode = address?.PostalCode.Trim() ?? string.Empty,
            CountryCode = address?.CountryCode.Trim().ToUpperInvariant() ?? "US",
            FulfillmentMethod = request.FulfillmentMethod,
            Status = payment.Paid ? OrderStatus.Paid : OrderStatus.Pending,
            PaymentStatus = payment.Paid ? PaymentStatus.Paid : PaymentStatus.Unpaid,
            Subtotal = subtotal,
            DiscountAmount = discount,
            ShippingAmount = shipping,
            TaxAmount = tax,
            Total = total,
            StripePaymentIntentId = payment.ExternalId,
            Items = products.Select(product => new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Sku = product.Sku,
                Quantity = requested[product.Id],
                UnitPrice = product.Price
            }).ToList()
        };
        _db.Orders.Add(order);
        if (coupon is not null)
        {
            coupon.UsageCount++;
        }

        await _db.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return Map(order);
    }

    private async Task<Coupon?> FindCouponAsync(string? code, decimal subtotal, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return null;
        }

        var normalized = code.Trim().ToUpperInvariant();
        var now = _timeProvider.GetUtcNow().UtcDateTime;
        var coupon = await _db.Coupons.SingleOrDefaultAsync(item => item.Code == normalized, cancellationToken)
            ?? throw ApiException.BadRequest("That promotion code is not valid.", "coupon_invalid");
        if (!coupon.IsActive || !coupon.AppliesToProducts || coupon.StartsAtUtc > now || coupon.EndsAtUtc < now ||
            (coupon.UsageLimit.HasValue && coupon.UsageCount >= coupon.UsageLimit) ||
            (coupon.MinimumSpend.HasValue && subtotal < coupon.MinimumSpend))
        {
            throw ApiException.BadRequest("That promotion code is not valid for this order.", "coupon_ineligible");
        }

        return coupon;
    }

    private static decimal CalculateDiscount(Coupon? coupon, decimal subtotal)
    {
        if (coupon is null)
        {
            return 0;
        }

        var amount = coupon.DiscountType == DiscountType.Percentage
            ? subtotal * coupon.DiscountValue / 100m
            : coupon.DiscountValue;
        if (coupon.MaximumDiscount.HasValue)
        {
            amount = Math.Min(amount, coupon.MaximumDiscount.Value);
        }

        return Math.Round(Math.Min(amount, subtotal), 2, MidpointRounding.AwayFromZero);
    }

    private static string CreateReference() =>
        $"SO{DateTime.UtcNow:yyMMdd}{Guid.NewGuid():N}"[..14].ToUpperInvariant();

    internal static OrderResponse Map(Order order) =>
        new(
            order.Id,
            order.Number,
            order.Status,
            order.PaymentStatus,
            order.Subtotal,
            order.DiscountAmount,
            order.ShippingAmount,
            order.TaxAmount,
            order.Total,
            order.CreatedAtUtc,
            order.Items.Select(item => new OrderLineDto(
                item.ProductId,
                item.ProductName,
                item.Sku,
                item.Quantity,
                item.UnitPrice)).ToArray());
}
