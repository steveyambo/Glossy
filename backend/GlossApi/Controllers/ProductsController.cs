using GlossApi.Data;
using GlossApi.DTOs;
using GlossApi.Models;
using GlossApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GlossApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly GlossDbContext _db;

    public ProductsController(GlossDbContext db)
    {
        _db = db;
    }

    private int? CurrentUserIdOrNull()
    {
        if (User.Identity?.IsAuthenticated != true) return null;
        try { return User.GetUserId(); } catch { return null; }
    }

    // GET /api/products — public, marque les favoris si connecté
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
    {
        var userId = CurrentUserIdOrNull();
        var favoriteIds = userId is null
            ? new HashSet<int>()
            : (await _db.Favorites.Where(f => f.UserId == userId).Select(f => f.ProductId).ToListAsync()).ToHashSet();

        var products = await _db.Products.OrderBy(p => p.Name).ToListAsync();

        return Ok(products.Select(p => ToDto(p, favoriteIds.Contains(p.Id))));
    }

    // GET /api/products/{id} — public
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetById(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();

        var userId = CurrentUserIdOrNull();
        var isFavorite = userId is not null &&
            await _db.Favorites.AnyAsync(f => f.UserId == userId && f.ProductId == id);

        return Ok(ToDto(product, isFavorite));
    }

    // POST /api/products — Admin uniquement
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ProductDto>> Create(ProductWriteDto dto)
    {
        var product = new Product
        {
            Name = dto.Name.Trim(),
            Shade = dto.Shade.Trim(),
            Description = dto.Description?.Trim() ?? string.Empty,
            Price = dto.Price,
            ColorHex = dto.ColorHex,
            ImageUrl = dto.ImageUrl?.Trim() ?? string.Empty,
            Finish = string.IsNullOrWhiteSpace(dto.Finish) ? "Glossy" : dto.Finish,
            InStock = dto.InStock
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, ToDto(product, false));
    }

    // PUT /api/products/{id} — Admin uniquement
    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<ProductDto>> Update(int id, ProductWriteDto dto)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();

        product.Name = dto.Name.Trim();
        product.Shade = dto.Shade.Trim();
        product.Description = dto.Description?.Trim() ?? string.Empty;
        product.Price = dto.Price;
        product.ColorHex = dto.ColorHex;
        product.ImageUrl = dto.ImageUrl?.Trim() ?? string.Empty;
        product.Finish = string.IsNullOrWhiteSpace(dto.Finish) ? "Glossy" : dto.Finish;
        product.InStock = dto.InStock;

        await _db.SaveChangesAsync();
        return Ok(ToDto(product, false));
    }

    // DELETE /api/products/{id} — Admin uniquement
    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return NotFound();

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static ProductDto ToDto(Product p, bool isFavorite) => new(
        p.Id, p.Name, p.Shade, p.Description, p.Price, p.ColorHex, p.ImageUrl, p.Finish, p.InStock, isFavorite
    );
}
