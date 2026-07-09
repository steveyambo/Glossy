using GlossApi.Data;
using GlossApi.DTOs;
using GlossApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GlossApi.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly GlossDbContext _db;

    public UsersController(GlossDbContext db)
    {
        _db = db;
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetMe()
    {
        var user = await _db.Users.FindAsync(User.GetUserId());
        if (user is null) return NotFound();

        return Ok(new UserProfileDto(user.Id, user.Email, user.DisplayName, user.Role, user.CreatedAt));
    }

    [HttpPut("me")]
    public async Task<ActionResult<UserProfileDto>> UpdateMe(UpdateProfileDto dto)
    {
        var user = await _db.Users.FindAsync(User.GetUserId());
        if (user is null) return NotFound();

        user.DisplayName = dto.DisplayName.Trim();
        await _db.SaveChangesAsync();

        return Ok(new UserProfileDto(user.Id, user.Email, user.DisplayName, user.Role, user.CreatedAt));
    }
}
