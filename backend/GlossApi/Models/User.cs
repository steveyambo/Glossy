namespace GlossApi.Models;

public static class Roles
{
    public const string Client = "Client";
    public const string Admin = "Admin";
}

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PasswordSalt { get; set; } = string.Empty;
    public string Role { get; set; } = Roles.Client;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Favorite> Favorites { get; set; } = new();
}
