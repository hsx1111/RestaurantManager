using Microsoft.Extensions.Configuration;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.Infrastructure.Repositories;

public class CommandeRepository : ICommandeRepository
{
    private readonly string _connectionString;

    public CommandeRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Chaîne de connexion 'DefaultConnection' introuvable.");
    }
}
