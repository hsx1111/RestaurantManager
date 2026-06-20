namespace RestaurantManager.Core.Models;

public class DetailCommande
{
    public int IdDetailCommande { get; set; }
    public int IdCommande { get; set; }
    public int IdPlat { get; set; }
    public int Quantite { get; set; }
    public decimal PrixUnitaire { get; set; }
    public bool Prepare { get; set; }
}
