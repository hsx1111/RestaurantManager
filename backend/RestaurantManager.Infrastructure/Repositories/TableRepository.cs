using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Exceptions;
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

    public TableDto? GetById(int id)
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.QuerySingleOrDefault<TableDto>(
            "SELECT IdTable AS Id, NombrePlace, EstLibre FROM restaurant_table WHERE IdTable = @Id",
            new { Id = id });
    }

    public int Add(TableCreateDto table)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = @"INSERT INTO restaurant_table (NombrePlace, EstLibre) VALUES (@NombrePlace, true);
                             SELECT LAST_INSERT_ID();";
        return connection.ExecuteScalar<int>(sql, new { table.NombrePlace });
    }

    public int Update(int id, TableUpdateDto table)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = "UPDATE restaurant_table SET NombrePlace = @NombrePlace WHERE IdTable = @Id";
        return connection.Execute(sql, new { table.NombrePlace, Id = id });
    }

    public int Delete(int id)
    {
        using var connection = new MySqlConnection(_connectionString);

        var estLibre = connection.QuerySingleOrDefault<bool?>(
            "SELECT EstLibre FROM restaurant_table WHERE IdTable = @Id", new { Id = id });
        if (estLibre is null)
        {
            return 0;
        }

        var nombreEnCours = connection.ExecuteScalar<int>(
            "SELECT COUNT(*) FROM commande WHERE IdTable = @Id AND Statut = 'EnCours'", new { Id = id });
        if (estLibre == false || nombreEnCours > 0)
        {
            throw new TableEnUsageException();
        }

        try
        {
            return connection.Execute("DELETE FROM restaurant_table WHERE IdTable = @Id", new { Id = id });
        }
        catch (MySqlException ex) when (ex.Number == (int)MySqlErrorCode.RowIsReferenced2)
        {
            throw new TableEnUsageException();
        }
    }
}
