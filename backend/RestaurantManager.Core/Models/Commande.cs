using RestaurantManager.Core.Enums;

namespace RestaurantManager.Core.Models;

public class Commande
{
    public int IdCommande { get; set; }
    public int IdUtilisateur { get; set; }
    public int? IdClient { get; set; }
    public int IdTable { get; set; }
    public StatutCommande Statut { get; set; }
    public TypeService TypeService { get; set; }
    public DateTime DateCommande { get; set; }
    public string? Notes { get; set; }
}
