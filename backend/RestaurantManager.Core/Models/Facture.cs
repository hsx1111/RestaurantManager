using RestaurantManager.Core.Enums;

namespace RestaurantManager.Core.Models;

public class Facture
{
    public int IdFacture { get; set; }
    public int IdCommande { get; set; }
    public decimal MontantTotal { get; set; }
    public ModePaiement ModePaiement { get; set; }
    public DateTime DateFacture { get; set; }
}
