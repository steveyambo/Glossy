using GlossApi.Data;
using GlossApi.DTOs;
using GlossApi.Models;
using GlossApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GlossApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly GlossDbContext _db;
    private readonly IPasswordService _passwordService;
    private readonly ITokenService _tokenService;

    public AuthController(GlossDbContext db, IPasswordService passwordService, ITokenService tokenService)
    {
        _db = db;
        _passwordService = passwordService;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        var emailNormalized = dto.Email.Trim().ToLowerInvariant();

        if (await _db.Users.AnyAsync(u => u.Email == emailNormalized))
        {
            return Conflict(new { message = "Un compte existe déjà avec cet email." });
        }

        var (hash, salt) = _passwordService.Hash(dto.Password);

        var user = new User
        {
            Email = emailNormalized,
            DisplayName = dto.DisplayName.Trim(),
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = Roles.Client
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var (token, expiresAt) = _tokenService.GenerateToken(user);
        return Ok(new AuthResponseDto(token, expiresAt, ToProfileDto(user)));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var emailNormalized = dto.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == emailNormalized);

        if (user is null || !_passwordService.Verify(dto.Password, user.PasswordHash, user.PasswordSalt))
        {
            return Unauthorized(new { message = "Email ou mot de passe incorrect." });
        }

        var (token, expiresAt) = _tokenService.GenerateToken(user);
        return Ok(new AuthResponseDto(token, expiresAt, ToProfileDto(user)));
    }

    private static UserProfileDto ToProfileDto(User u) =>
        new(u.Id, u.Email, u.DisplayName, u.Role, u.CreatedAt);
}
