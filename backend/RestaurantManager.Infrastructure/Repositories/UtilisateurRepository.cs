using Microsoft.Extensions.Configuration;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.Infrastructure.Repositories;

public class UtilisateurRepository : IUtilisateurRepository
{
    private readonly string _connectionString;

    public UtilisateurRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Chaîne de connexion 'DefaultConnection' introuvable.");
    }
}
