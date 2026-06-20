namespace RestaurantManager.Core.Models;

public class Plat
{
    public int IdPlat { get; set; }
    public string NomPlat { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Prix { get; set; }
    public int IdCategorie { get; set; }
}
