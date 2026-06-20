using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.Exceptions;
using RestaurantManager.Core.Models;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.Infrastructure.Repositories;

public class CategorieRepository : ICategorieRepository
{
    private readonly string _connectionString;

    public CategorieRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Chaîne de connexion 'DefaultConnection' introuvable.");
    }

    public IEnumerable<Categorie> GetAll()
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.Query<Categorie>("SELECT IdCategorie, NomCategorie FROM categorie ORDER BY NomCategorie");
    }

    public Categorie? GetById(int id)
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.QuerySingleOrDefault<Categorie>(
            "SELECT IdCategorie, NomCategorie FROM categorie WHERE IdCategorie = @Id",
            new { Id = id });
    }

    public int Add(Categorie categorie)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = @"INSERT INTO categorie (NomCategorie) VALUES (@NomCategorie);
                             SELECT LAST_INSERT_ID();";
        try
        {
            return connection.ExecuteScalar<int>(sql, new { categorie.NomCategorie });
        }
        catch (MySqlException ex) when (ex.Number == (int)MySqlErrorCode.DuplicateKeyEntry)
        {
            throw new CategorieDupliqueeException();
        }
    }

    public int Update(Categorie categorie)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = "UPDATE categorie SET NomCategorie = @NomCategorie WHERE IdCategorie = @IdCategorie";
        try
        {
            return connection.Execute(sql, new { categorie.NomCategorie, categorie.IdCategorie });
        }
        catch (MySqlException ex) when (ex.Number == (int)MySqlErrorCode.DuplicateKeyEntry)
        {
            throw new CategorieDupliqueeException();
        }
    }

    public int Delete(int id)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = "DELETE FROM categorie WHERE IdCategorie = @Id";
        return connection.Execute(sql, new { Id = id });
    }
}
