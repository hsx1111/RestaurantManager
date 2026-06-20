using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.Models;
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

    public Utilisateur? GetByPin(string pinPlain)
    {
        using var connection = new MySqlConnection(_connectionString);
        var utilisateurs = connection.Query<Utilisateur>("SELECT * FROM utilisateur");

        foreach (var utilisateur in utilisateurs)
        {
            if (BCrypt.Net.BCrypt.Verify(pinPlain, utilisateur.Code))
            {
                return utilisateur;
            }
        }

        return null;
    }
}
