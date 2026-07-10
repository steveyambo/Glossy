using GlossApi.Data;
using GlossApi.DTOs;
using GlossApi.Models;
using GlossApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GlossApi.Controllers;

[ApiController]
[Route("api/favorites")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly GlossDbContext _db;

    public FavoritesController(GlossDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetMyFavorites()
    {
        var userId = User.GetUserId();

        var products = await _db.Favorites
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.AddedAt)
            .Select(f => f.Product)
            .ToListAsync();

        return Ok(products.Select(p => new ProductDto(
            p.Id, p.Name, p.Shade, p.Description, p.Price, p.ColorHex, p.ImageUrl, p.Finish, p.InStock, true
        )));
    }

    [HttpPost("{productId:int}")]
    public async Task<IActionResult> Add(int productId)
    {
        var userId = User.GetUserId();

        var productExists = await _db.Products.AnyAsync(p => p.Id == productId);
        if (!productExists) return NotFound(new { message = "Produit introuvable." });

        var alreadyExists = await _db.Favorites.AnyAsync(f => f.UserId == userId && f.ProductId == productId);
        if (!alreadyExists)
        {
            _db.Favorites.Add(new Favorite { UserId = userId, ProductId = productId });
            await _db.SaveChangesAsync();
        }

        return NoContent();
    }

    [HttpDelete("{productId:int}")]
    public async Task<IActionResult> Remove(int productId)
    {
        var userId = User.GetUserId();

        var favorite = await _db.Favorites.FindAsync(userId, productId);
        if (favorite is not null)
        {
            _db.Favorites.Remove(favorite);
            await _db.SaveChangesAsync();
        }

        return NoContent();
    }
}
