using System.ComponentModel.DataAnnotations;

namespace GlossApi.DTOs;

public record ProductDto(
    int Id,
    string Name,
    string Shade,
    string Description,
    decimal Price,
    string ColorHex,
    string ImageUrl,
    string Finish,
    bool InStock,
    bool IsFavorite
);

public record ProductWriteDto(
    [Required, MinLength(1)] string Name,
    [Required] string Shade,
    string Description,
    [Range(0, 10000)] decimal Price,
    [Required] string ColorHex,
    string? ImageUrl,
    string Finish,
    bool InStock
);
