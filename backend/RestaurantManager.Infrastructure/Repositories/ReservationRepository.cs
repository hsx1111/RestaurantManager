using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Exceptions;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.Infrastructure.Repositories;

public class ReservationRepository : IReservationRepository
{
    private const string SelectBase = @"SELECT r.IdReservation AS Id, r.IdTable, t.IdTable AS NumeroTable,
                                               r.IdClient, CONCAT(cl.Prenom, ' ', cl.Nom) AS NomClient,
                                               r.NombrePersonne, r.DateHeureDebut, r.DateHeureFin, r.Statut, r.Notes
                                        FROM reservation r
                                        INNER JOIN client cl ON cl.IdClient = r.IdClient
                                        INNER JOIN restaurant_table t ON t.IdTable = r.IdTable";

    private readonly string _connectionString;

    public ReservationRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Chaîne de connexion 'DefaultConnection' introuvable.");
    }

    public IEnumerable<ReservationDto> GetAll()
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.Query<ReservationDto>($"{SelectBase} ORDER BY r.DateHeureDebut");
    }

    public ReservationDto? GetById(int id)
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.QuerySingleOrDefault<ReservationDto>(
            $"{SelectBase} WHERE r.IdReservation = @Id", new { Id = id });
    }

    public int Add(ReservationCreateDto reservation)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = @"INSERT INTO reservation (IdTable, IdClient, NombrePersonne, DateHeureDebut, DateHeureFin, Notes)
                             VALUES (@IdTable, @IdClient, @NombrePersonne, @DateHeureDebut, @DateHeureFin, @Notes);
                             SELECT LAST_INSERT_ID();";
        try
        {
            return connection.ExecuteScalar<int>(sql, reservation);
        }
        catch (MySqlException ex) when (ex.SqlState == "45000")
        {
            throw new ReservationChevauchementException();
        }
    }

    public int Update(int id, ReservationUpdateDto reservation)
    {
        using var connection = new MySqlConnection(_connectionString);
        const string sql = @"UPDATE reservation
                             SET IdTable = @IdTable, IdClient = @IdClient, NombrePersonne = @NombrePersonne,
                                 DateHeureDebut = @DateHeureDebut, DateHeureFin = @DateHeureFin,
                                 Statut = @Statut, Notes = @Notes
                             WHERE IdReservation = @Id";
        try
        {
            return connection.Execute(sql, new
            {
                reservation.IdTable,
                reservation.IdClient,
                reservation.NombrePersonne,
                reservation.DateHeureDebut,
                reservation.DateHeureFin,
                reservation.Statut,
                reservation.Notes,
                Id = id
            });
        }
        catch (MySqlException ex) when (ex.SqlState == "45000")
        {
            throw new ReservationChevauchementException();
        }
    }

    public int Delete(int id)
    {
        using var connection = new MySqlConnection(_connectionString);
        return connection.Execute("DELETE FROM reservation WHERE IdReservation = @Id", new { Id = id });
    }
}
