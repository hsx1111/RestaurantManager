using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Entities;
using RestaurantManager.Core.Exceptions;
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

    public IEnumerable<PlatDto> GetAllAvecCategorie()
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = @"SELECT p.IdPlat AS Id, p.NomPlat AS Nom, p.Description AS Description,
                                    p.Prix AS Prix, p.IdCategorie AS IdCategorie, c.NomCategorie AS NomCategorie
                             FROM plat p
                             INNER JOIN categorie c ON c.IdCategorie = p.IdCategorie
                             ORDER BY p.NomPlat";
        return connection.Query<PlatDto>(sql);
    }

    public Plat GetById(int id)
    {
        using var connection = new MySqlConnection(_connectionString);
        var plat = connection.QuerySingleOrDefault<Plat>(
            "SELECT IdPlat, NomPlat, Description, Prix, IdCategorie FROM plat WHERE IdPlat = @Id",
            new { Id = id });

        return plat ?? throw new PlatNotFoundException(id);
    }

    public int Add(PlatCreateDto plat)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = @"INSERT INTO plat (NomPlat, Description, Prix, IdCategorie)
                             VALUES (@Nom, @Description, @Prix, @IdCategorie);
                             SELECT LAST_INSERT_ID();";
        try
        {
            return connection.ExecuteScalar<int>(sql, new { plat.Nom, plat.Description, plat.Prix, plat.IdCategorie });
        }
        catch (MySqlException ex) when (ex.Number == (int)MySqlErrorCode.NoReferencedRow2)
        {
            throw new CategorieNotFoundException(plat.IdCategorie);
        }
    }

    public void Update(int id, PlatUpdateDto plat)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = @"UPDATE plat SET NomPlat = @Nom, Description = @Description, Prix = @Prix, IdCategorie = @IdCategorie
                             WHERE IdPlat = @Id";
        int lignesAffectees;
        try
        {
            lignesAffectees = connection.Execute(sql, new { plat.Nom, plat.Description, plat.Prix, plat.IdCategorie, Id = id });
        }
        catch (MySqlException ex) when (ex.Number == (int)MySqlErrorCode.NoReferencedRow2)
        {
            throw new CategorieNotFoundException(plat.IdCategorie);
        }

        if (lignesAffectees == 0)
        {
            throw new PlatNotFoundException(id);
        }
    }

    public void Delete(int id)
    {
        using var connection = new MySqlConnection(_connectionString);
        var lignesAffectees = connection.Execute("DELETE FROM plat WHERE IdPlat = @Id", new { Id = id });
        if (lignesAffectees == 0)
        {
            throw new PlatNotFoundException(id);
        }
    }
}
