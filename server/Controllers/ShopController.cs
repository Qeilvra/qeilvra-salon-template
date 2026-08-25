using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Salon.Api.Data;
using Salon.Api.DTOs;
using Salon.Api.Infrastructure;
using Salon.Api.Services;

namespace Salon.Api.Controllers;

[ApiController]
[Route("api/v1/shop")]
public sealed class ShopController : ControllerBase
{
    private readonly SalonDbContext _db;
    private readonly IShopService _shop;

    public ShopController(SalonDbContext db, IShopService shop)
    {
        _db = db;
        _shop = shop;
    }

    [HttpGet("products")]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<ProductCardDto>>> Products(
        [FromQuery] string? category,
        [FromQuery] bool? featured,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var query = _db.Products.AsNoTracking().Where(product => product.IsActive);
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(product => product.Category.Slug == category);
        }
        if (featured.HasValue)
        {
            query = query.Where(product => product.IsFeatured == featured);
        }
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(product => product.Name.Contains(term) || product.ShortDescription.Contains(term));
        }

        var total = await query.CountAsync(cancellationToken);
        var products = await query
            .OrderByDescending(product => product.IsFeatured)
            .ThenBy(product => product.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(product => new ProductCardDto(
                product.Id,
                product.CategoryId,
                product.Category.Name,
                product.Name,
                product.Slug,
                product.Sku,
                product.ShortDescription,
                product.Price,
                product.CompareAtPrice,
                !product.TrackInventory || product.StockQuantity > 0,
                product.PrimaryImageUrl,
                product.IsFeatured))
            .ToListAsync(cancellationToken);
        return Ok(new PagedResult<ProductCardDto>(products, page, pageSize, total));
    }

    [HttpGet("products/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductDetailDto>> Product(string slug, CancellationToken cancellationToken)
    {
        var product = await _db.Products
            .AsNoTracking()
            .Include(item => item.Category)
            .Include(item => item.Images)
            .SingleOrDefaultAsync(item => item.Slug == slug && item.IsActive, cancellationToken)
            ?? throw ApiException.NotFound("Product not found.", "product_not_found");
        var related = await _db.Products
            .AsNoTracking()
            .Where(item => item.IsActive && item.CategoryId == product.CategoryId && item.Id != product.Id)
            .Take(4)
            .Select(item => new ProductCardDto(
                item.Id,
                item.CategoryId,
                item.Category.Name,
                item.Name,
                item.Slug,
                item.Sku,
                item.ShortDescription,
                item.Price,
                item.CompareAtPrice,
                !item.TrackInventory || item.StockQuantity > 0,
                item.PrimaryImageUrl,
                item.IsFeatured))
            .ToListAsync(cancellationToken);

        return Ok(new ProductDetailDto(
            product.Id,
            product.CategoryId,
            product.Category.Name,
            product.Name,
            product.Slug,
            product.Sku,
            product.ShortDescription,
            product.Description,
            product.Price,
            product.CompareAtPrice,
            product.StockQuantity,
            product.PrimaryImageUrl,
            product.Images.OrderBy(image => image.SortOrder).Select(image => image.Url).ToArray(),
            related));
    }

    [HttpPost("checkout")]
    [AllowAnonymous]
    [ProducesResponseType<OrderResponse>(StatusCodes.Status201Created)]
    public async Task<ActionResult<OrderResponse>> Checkout(
        CheckoutRequest request,
        CancellationToken cancellationToken)
    {
        var order = await _shop.CheckoutAsync(request, User.GetUserId(), cancellationToken);
        return Created($"/api/v1/account/orders/{order.Id}", order);
    }
}
