using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.DTOs;
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

    public IEnumerable<UtilisateurDto> GetAll()
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.Query<UtilisateurDto>(
            "SELECT IdUtilisateur AS Id, Nom, Prenom, Role FROM utilisateur ORDER BY Nom, Prenom");
    }

    public UtilisateurDto? GetById(int id)
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.QuerySingleOrDefault<UtilisateurDto>(
            "SELECT IdUtilisateur AS Id, Nom, Prenom, Role FROM utilisateur WHERE IdUtilisateur = @Id",
            new { Id = id });
    }

    public int Add(UtilisateurCreateDto utilisateur)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = @"INSERT INTO utilisateur (Nom, Prenom, Code, Role)
                             VALUES (@Nom, @Prenom, @Code, @Role);
                             SELECT LAST_INSERT_ID();";
        return connection.ExecuteScalar<int>(sql, new
        {
            utilisateur.Nom,
            utilisateur.Prenom,
            Code = BCrypt.Net.BCrypt.HashPassword(utilisateur.Pin),
            utilisateur.Role
        });
    }

    public int Update(int id, UtilisateurUpdateDto utilisateur)
    {
        using var connection = new MySqlConnection(_connectionString);

        if (!string.IsNullOrWhiteSpace(utilisateur.Pin))
        {
            const string sqlAvecPin = @"UPDATE utilisateur SET Nom = @Nom, Prenom = @Prenom, Role = @Role, Code = @Code
                                        WHERE IdUtilisateur = @Id";
            return connection.Execute(sqlAvecPin, new
            {
                utilisateur.Nom,
                utilisateur.Prenom,
                utilisateur.Role,
                Code = BCrypt.Net.BCrypt.HashPassword(utilisateur.Pin),
                Id = id
            });
        }

        const string sql = @"UPDATE utilisateur SET Nom = @Nom, Prenom = @Prenom, Role = @Role
                             WHERE IdUtilisateur = @Id";
        return connection.Execute(sql, new { utilisateur.Nom, utilisateur.Prenom, utilisateur.Role, Id = id });
    }

    public int Delete(int id)
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.Execute("DELETE FROM utilisateur WHERE IdUtilisateur = @Id", new { Id = id });
    }
}
