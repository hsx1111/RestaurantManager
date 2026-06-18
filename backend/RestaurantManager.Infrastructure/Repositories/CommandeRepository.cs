using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.DTOs;
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

    public int Create(CommandeCreateDto commande, int idUtilisateur)
    {
        using var connection = new MySqlConnection(_connectionString);
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            const string insertCommande = @"INSERT INTO commande (IdUtilisateur, IdClient, IdTable, Statut, TypeService)
                                            VALUES (@IdUtilisateur, @IdClient, @IdTable, 'EnCours', 'Salle');
                                            SELECT LAST_INSERT_ID();";
            var idCommande = connection.ExecuteScalar<int>(insertCommande, new
            {
                IdUtilisateur = idUtilisateur,
                commande.IdClient,
                commande.IdTable
            }, transaction);

            const string selectPrix = "SELECT Prix FROM plat WHERE IdPlat = @IdPlat";
            const string insertDetail = @"INSERT INTO detailcommande (IdCommande, IdPlat, Quantite, PrixUnitaire)
                                          VALUES (@IdCommande, @IdPlat, @Quantite, @PrixUnitaire)";

            foreach (var ligne in commande.Lignes)
            {
                var prixUnitaire = connection.ExecuteScalar<decimal>(selectPrix, new { ligne.IdPlat }, transaction);
                connection.Execute(insertDetail, new
                {
                    IdCommande = idCommande,
                    ligne.IdPlat,
                    ligne.Quantite,
                    PrixUnitaire = prixUnitaire
                }, transaction);
            }

            connection.Execute("UPDATE restaurant_table SET EstLibre = false WHERE IdTable = @IdTable",
                new { commande.IdTable }, transaction);

            transaction.Commit();
            return idCommande;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public CommandeDetailDto? GetById(int id)
    {
        using var connection = new MySqlConnection(_connectionString);

        const string sql = @"SELECT c.IdCommande AS Id, c.IdTable AS NumeroTable,
                                    CONCAT(u.Prenom, ' ', u.Nom) AS NomServeur,
                                    d.IdPlat AS IdPlat, p.NomPlat AS NomPlat,
                                    d.Quantite AS Quantite, d.PrixUnitaire AS PrixUnitaire
                             FROM commande c
                             INNER JOIN utilisateur u ON u.IdUtilisateur = c.IdUtilisateur
                             INNER JOIN detailcommande d ON d.IdCommande = c.IdCommande
                             INNER JOIN plat p ON p.IdPlat = d.IdPlat
                             WHERE c.IdCommande = @Id";

        CommandeDetailDto? commande = null;
        connection.Query<CommandeDetailDto, LigneDetailDto, CommandeDetailDto>(
            sql,
            (entete, ligne) =>
            {
                commande ??= entete;
                commande.Lignes.Add(ligne);
                return commande;
            },
            new { Id = id },
            splitOn: "IdPlat");

        if (commande is not null)
        {
            commande.Total = commande.Lignes.Sum(l => l.PrixUnitaire * l.Quantite);
        }

        return commande;
    }
}
