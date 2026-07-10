namespace GlossApi.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Shade { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ColorHex { get; set; } = "#E8A9BD";
    public string ImageUrl { get; set; } = string.Empty;
    public string Finish { get; set; } = "Glossy";
    public bool InStock { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Favorite> Favorites { get; set; } = new();
}
