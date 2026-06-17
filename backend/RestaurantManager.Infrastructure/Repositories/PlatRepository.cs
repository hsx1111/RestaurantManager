using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.Infrastructure.Repositories;

public class PlatRepository : IPlatRepository
{
    private readonly string _connectionString;

    public PlatRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Chaîne de connexion 'DefaultConnection' introuvable.");
    }

    public int CountByCategorie(int idCategorie)
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.ExecuteScalar<int>(
            "SELECT COUNT(*) FROM plat WHERE IdCategorie = @IdCategorie",
            new { IdCategorie = idCategorie });
    }
}
