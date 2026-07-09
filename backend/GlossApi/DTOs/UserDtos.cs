using System.ComponentModel.DataAnnotations;

namespace GlossApi.DTOs;

public record UserProfileDto(
    int Id,
    string Email,
    string DisplayName,
    string Role,
    DateTime CreatedAt
);

public record UpdateProfileDto(
    [Required, MinLength(2)] string DisplayName
);
