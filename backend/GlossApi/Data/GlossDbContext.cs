using GlossApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GlossApi.Data;

public class GlossDbContext : DbContext
{
    public GlossDbContext(DbContextOptions<GlossDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Favorite> Favorites => Set<Favorite>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Favorite>()
            .HasKey(f => new { f.UserId, f.ProductId });

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.User)
            .WithMany(u => u.Favorites)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Favorite>()
            .HasOne(f => f.Product)
            .WithMany(p => p.Favorites)
            .HasForeignKey(f => f.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasColumnType("decimal(10,2)");
    }
}
