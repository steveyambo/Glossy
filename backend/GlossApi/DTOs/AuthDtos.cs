using System.ComponentModel.DataAnnotations;

namespace GlossApi.DTOs;

public record RegisterDto(
    [Required, EmailAddress] string Email,
    [Required, MinLength(2)] string DisplayName,
    [Required, MinLength(8)] string Password
);

public record LoginDto(
    [Required, EmailAddress] string Email,
    [Required] string Password
);

public record AuthResponseDto(
    string Token,
    DateTime ExpiresAt,
    UserProfileDto User
);
