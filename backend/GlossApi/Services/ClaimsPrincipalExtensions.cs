using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace GlossApi.Services;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(JwtRegisteredClaimNames.Sub)
                    ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.Parse(value ?? throw new InvalidOperationException("Utilisateur non authentifié."));
    }
}
