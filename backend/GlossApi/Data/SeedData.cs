using GlossApi.Models;
using GlossApi.Services;

namespace GlossApi.Data;

public static class SeedData
{
    public static void Seed(GlossDbContext db, IPasswordService passwordService)
    {
        if (!db.Users.Any())
        {
            var (hash, salt) = passwordService.Hash("Admin123!");
            db.Users.Add(new User
            {
                Email = "admin@lueur.fr",
                DisplayName = "Équipe LUEUR",
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = Roles.Admin
            });
        }

        if (!db.Products.Any())
        {
            db.Products.AddRange(
                new Product { Name = "Velours Nu", Shade = "Nude rosé", Description = "Un gloss nude au fini soyeux, parfait pour un quotidien lumineux sans surcharge.", Price = 18.50m, ColorHex = "#D9A5A0", Finish = "Satiné", InStock = true },
                new Product { Name = "Grenat Miroir", Shade = "Rouge profond", Description = "Un rouge intense à l'effet miroir, pour une bouche qui capte la lumière.", Price = 21.00m, ColorHex = "#7A1F2B", Finish = "Miroir", InStock = true },
                new Product { Name = "Pêche Halo", Shade = "Corail doux", Description = "Une touche de pêche nacrée qui illumine le teint en un geste.", Price = 17.00m, ColorHex = "#E8A97A", Finish = "Nacré", InStock = true },
                new Product { Name = "Prune Nocturne", Shade = "Prune profond", Description = "Un gloss prune envoûtant, pensé pour les soirées.", Price = 22.50m, ColorHex = "#4A2438", Finish = "Glossy", InStock = true },
                new Product { Name = "Rose Cristal", Shade = "Rose translucide", Description = "Un voile rosé quasi transparent, à l'effet verre bombé.", Price = 16.00m, ColorHex = "#E8C4CE", Finish = "Cristal", InStock = true },
                new Product { Name = "Cuivre Solaire", Shade = "Cuivre chaud", Description = "Une teinte cuivrée chatoyante, en édition limitée.", Price = 24.00m, ColorHex = "#B5652F", Finish = "Métallisé", InStock = false }
            );
        }

        db.SaveChanges();
    }
}
