using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using RestaurantManager.Core.Enums;

namespace RestaurantManager.Infrastructure;

public class DataSeeder
{
    private readonly string _connectionString;

    public DataSeeder(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Chaîne de connexion 'DefaultConnection' introuvable.");
    }

    public void Seed()
    {
        using var connection = new MySqlConnection(_connectionString);
        connection.Open();

        var nombreUtilisateurs = connection.ExecuteScalar<int>("SELECT COUNT(*) FROM utilisateur");
        if (nombreUtilisateurs > 0)
        {
            return;
        }

        using var transaction = connection.BeginTransaction();
        try
        {
            SeedUtilisateurs(connection, transaction);
            SeedClient(connection, transaction);
            SeedCategoriesEtPlats(connection, transaction);
            SeedTables(connection, transaction);

            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    private static void SeedUtilisateurs(MySqlConnection connection, MySqlTransaction transaction)
    {
        const string sql = @"INSERT INTO utilisateur (Nom, Prenom, Code, Role)
                             VALUES (@Nom, @Prenom, @Code, @Role)";

        connection.Execute(sql, new[]
        {
            new { Nom = "Dubois", Prenom = "Marie", Code = BCrypt.Net.BCrypt.HashPassword("1234"), Role = Role.Gestionnaire.ToString() },
            new { Nom = "Martin", Prenom = "Jean", Code = BCrypt.Net.BCrypt.HashPassword("5678"), Role = Role.Serveur.ToString() },
            new { Nom = "Cuisine", Prenom = "Cuistot", Code = BCrypt.Net.BCrypt.HashPassword("9999"), Role = Role.Cuisine.ToString() }
        }, transaction);
    }

    private static void SeedClient(MySqlConnection connection, MySqlTransaction transaction)
    {
        const string sql = @"INSERT INTO client (Nom, Prenom, Telephone, Email, DateInscription)
                             VALUES (@Nom, @Prenom, @Telephone, @Email, @DateInscription)";

        connection.Execute(sql, new
        {
            Nom = "Dupont",
            Prenom = "Jean",
            Telephone = (string?)null,
            Email = (string?)null,
            DateInscription = DateTime.Now
        }, transaction);
    }

    private static void SeedCategoriesEtPlats(MySqlConnection connection, MySqlTransaction transaction)
    {
        const string insertCategorie = @"INSERT INTO categorie (NomCategorie) VALUES (@NomCategorie);
                                         SELECT LAST_INSERT_ID();";

        var idEntrees = connection.ExecuteScalar<int>(insertCategorie, new { NomCategorie = "Entrées" }, transaction);
        var idPlats = connection.ExecuteScalar<int>(insertCategorie, new { NomCategorie = "Plats" }, transaction);

        const string insertPlat = @"INSERT INTO plat (NomPlat, Description, Prix, IdCategorie)
                                    VALUES (@NomPlat, @Description, @Prix, @IdCategorie)";

        connection.Execute(insertPlat, new[]
        {
            new { NomPlat = "Salade César", Description = (string?)null, Prix = 12.00m, IdCategorie = idEntrees },
            new { NomPlat = "Bruschetta", Description = (string?)null, Prix = 8.00m, IdCategorie = idEntrees },
            new { NomPlat = "Carbonara", Description = (string?)null, Prix = 14.50m, IdCategorie = idPlats },
            new { NomPlat = "Pizza Reine", Description = (string?)null, Prix = 13.00m, IdCategorie = idPlats },
            new { NomPlat = "Steak frites", Description = (string?)null, Prix = 18.00m, IdCategorie = idPlats }
        }, transaction);
    }

    private static void SeedTables(MySqlConnection connection, MySqlTransaction transaction)
    {
        const string sql = @"INSERT INTO restaurant_table (NombrePlace, EstLibre)
                             VALUES (@NombrePlace, @EstLibre)";

        connection.Execute(sql, new[]
        {
            new { NombrePlace = 2, EstLibre = true },
            new { NombrePlace = 2, EstLibre = true },
            new { NombrePlace = 4, EstLibre = true },
            new { NombrePlace = 4, EstLibre = true },
            new { NombrePlace = 6, EstLibre = true },
            new { NombrePlace = 8, EstLibre = true }
        }, transaction);
    }
}
