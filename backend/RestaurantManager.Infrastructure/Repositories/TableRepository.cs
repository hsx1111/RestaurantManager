using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.Infrastructure.Repositories;

public class TableRepository : ITableRepository
{
    private readonly string _connectionString;

    public TableRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Chaîne de connexion 'DefaultConnection' introuvable.");
    }

    public IEnumerable<TableDto> GetAll()
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.Query<TableDto>(
            "SELECT IdTable AS Id, NombrePlace, EstLibre FROM restaurant_table ORDER BY IdTable");
    }
}
