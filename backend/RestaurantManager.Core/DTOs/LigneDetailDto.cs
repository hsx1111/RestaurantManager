namespace RestaurantManager.Core.DTOs;

public class LigneDetailDto
{
    public int IdPlat { get; set; }
    public string NomPlat { get; set; } = string.Empty;
    public int Quantite { get; set; }
    public decimal PrixUnitaire { get; set; }
}
