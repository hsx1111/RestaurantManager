using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.Infrastructure.Repositories;

public class ClientRepository : IClientRepository
{
    private readonly string _connectionString;

    public ClientRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Chaîne de connexion 'DefaultConnection' introuvable.");
    }

    public IEnumerable<ClientDto> GetAll()
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.Query<ClientDto>(
            "SELECT IdClient AS Id, Nom, Prenom FROM client ORDER BY Nom, Prenom");
    }

    public int Add(ClientCreateDto client)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = @"INSERT INTO client (Nom, Prenom, Telephone, Email, DateInscription)
                             VALUES (@Nom, @Prenom, @Telephone, @Email, NOW());
                             SELECT LAST_INSERT_ID();";
        return connection.ExecuteScalar<int>(sql, new { client.Nom, client.Prenom, client.Telephone, client.Email });
    }
}
