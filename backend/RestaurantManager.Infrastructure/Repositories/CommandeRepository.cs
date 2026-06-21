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
        const string sql = @"SELECT c.IdCommande AS Id, c.IdTable AS NumeroTable,
                                    CONCAT(u.Prenom, ' ', u.Nom) AS NomServeur, c.Statut AS Statut,
                                    d.IdPlat AS IdPlat, p.NomPlat AS NomPlat,
                                    d.Quantite AS Quantite, d.PrixUnitaire AS PrixUnitaire
                             FROM commande c
                             INNER JOIN utilisateur u ON u.IdUtilisateur = c.IdUtilisateur
                             INNER JOIN detailcommande d ON d.IdCommande = c.IdCommande
                             INNER JOIN plat p ON p.IdPlat = d.IdPlat
                             WHERE c.IdCommande = @Id";
        return ChargerCommande(sql, new { Id = id });
    }

    public CommandeDetailDto? GetCommandeActiveParTable(int idTable)
    {
        const string sql = @"SELECT c.IdCommande AS Id, c.IdTable AS NumeroTable,
                                    CONCAT(u.Prenom, ' ', u.Nom) AS NomServeur, c.Statut AS Statut,
                                    d.IdPlat AS IdPlat, p.NomPlat AS NomPlat,
                                    d.Quantite AS Quantite, d.PrixUnitaire AS PrixUnitaire
                             FROM commande c
                             INNER JOIN utilisateur u ON u.IdUtilisateur = c.IdUtilisateur
                             INNER JOIN detailcommande d ON d.IdCommande = c.IdCommande
                             INNER JOIN plat p ON p.IdPlat = d.IdPlat
                             WHERE c.IdTable = @IdTable AND c.Statut IN ('EnCours', 'Servie')";
        return ChargerCommande(sql, new { IdTable = idTable });
    }

    private CommandeDetailDto? ChargerCommande(string sql, object parametres)
    {
        using var connection = new MySqlConnection(_connectionString);

        CommandeDetailDto? commande = null;
        connection.Query<CommandeDetailDto, LigneDetailDto, CommandeDetailDto>(
            sql,
            (entete, ligne) =>
            {
                commande ??= entete;
                commande.Lignes.Add(ligne);
                return commande;
            },
            parametres,
            splitOn: "IdPlat");

        if (commande is not null)
        {
            commande.Total = commande.Lignes.Sum(l => l.PrixUnitaire * l.Quantite);
        }

        return commande;
    }

    public void AjouterLignes(int idCommande, IEnumerable<LigneCreateDto> lignes)
    {
        using var connection = new MySqlConnection(_connectionString);
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            const string selectPrix = "SELECT Prix FROM plat WHERE IdPlat = @IdPlat";
            const string upsert = @"INSERT INTO detailcommande (IdCommande, IdPlat, Quantite, PrixUnitaire)
                                    VALUES (@IdCommande, @IdPlat, @Quantite, @PrixUnitaire)
                                    ON DUPLICATE KEY UPDATE Quantite = Quantite + VALUES(Quantite)";

            foreach (var ligne in lignes)
            {
                var prixUnitaire = connection.ExecuteScalar<decimal>(selectPrix, new { ligne.IdPlat }, transaction);
                connection.Execute(upsert, new
                {
                    IdCommande = idCommande,
                    ligne.IdPlat,
                    ligne.Quantite,
                    PrixUnitaire = prixUnitaire
                }, transaction);
            }

            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public FactureDto Cloturer(int idCommande, string modePaiement)
    {
        using var connection = new MySqlConnection(_connectionString);
        connection.Open();
        using var transaction = connection.BeginTransaction();
        try
        {
            var total = connection.ExecuteScalar<decimal>(
                "SELECT COALESCE(SUM(Quantite * PrixUnitaire), 0) FROM detailcommande WHERE IdCommande = @IdCommande",
                new { IdCommande = idCommande }, transaction);

            const string insertFacture = @"INSERT INTO facture (IdCommande, MontantTotal, ModePaiement, DateFacture)
                                           VALUES (@IdCommande, @MontantTotal, @ModePaiement, NOW());
                                           SELECT LAST_INSERT_ID();";
            var idFacture = connection.ExecuteScalar<int>(insertFacture, new
            {
                IdCommande = idCommande,
                MontantTotal = total,
                ModePaiement = modePaiement
            }, transaction);

            connection.Execute("UPDATE commande SET Statut = 'Facturee' WHERE IdCommande = @IdCommande",
                new { IdCommande = idCommande }, transaction);

            connection.Execute(@"UPDATE restaurant_table SET EstLibre = true
                                 WHERE IdTable = (SELECT IdTable FROM commande WHERE IdCommande = @IdCommande)",
                new { IdCommande = idCommande }, transaction);

            transaction.Commit();

            return new FactureDto
            {
                IdFacture = idFacture,
                IdCommande = idCommande,
                MontantTotal = total,
                ModePaiement = modePaiement,
                DateFacture = DateTime.Now
            };
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public List<TicketCuisineDto> GetTicketsEnCours()
    {
        using var connection = new MySqlConnection(_connectionString);

        const string sql = @"SELECT c.IdCommande AS IdCommande, c.IdTable AS NumeroTable,
                                    CONCAT(u.Prenom, ' ', u.Nom) AS NomServeur, c.DateCommande AS DateEnvoi,
                                    d.IdDetailCommande AS IdDetail, p.NomPlat AS NomPlat,
                                    d.Quantite AS Quantite, d.Prepare AS Prepare
                             FROM commande c
                             INNER JOIN utilisateur u ON u.IdUtilisateur = c.IdUtilisateur
                             INNER JOIN detailcommande d ON d.IdCommande = c.IdCommande
                             INNER JOIN plat p ON p.IdPlat = d.IdPlat
                             WHERE c.Statut = 'EnCours'
                             ORDER BY c.DateCommande";

        var tickets = new Dictionary<int, TicketCuisineDto>();
        connection.Query<TicketCuisineDto, LigneTicketDto, TicketCuisineDto>(
            sql,
            (ticket, ligne) =>
            {
                if (!tickets.TryGetValue(ticket.IdCommande, out var existant))
                {
                    existant = ticket;
                    tickets.Add(existant.IdCommande, existant);
                }
                existant.Lignes.Add(ligne);
                return existant;
            },
            splitOn: "IdDetail");

        return tickets.Values.ToList();
    }

    public void MarquerLignePrete(int idDetail)
    {
        using var connection = new MySqlConnection(_connectionString);
        connection.Execute("UPDATE detailcommande SET Prepare = true WHERE IdDetailCommande = @IdDetail",
            new { IdDetail = idDetail });
    }

    public void MarquerCommandeServie(int idCommande)
    {
        using var connection = new MySqlConnection(_connectionString);
        connection.Execute("UPDATE commande SET Statut = 'Servie' WHERE IdCommande = @IdCommande",
            new { IdCommande = idCommande });
    }
}
