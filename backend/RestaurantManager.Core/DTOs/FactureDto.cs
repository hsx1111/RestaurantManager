namespace RestaurantManager.Core.DTOs;

public class FactureDto
{
    public int IdFacture { get; set; }
    public int IdCommande { get; set; }
    public decimal MontantTotal { get; set; }
    public string ModePaiement { get; set; } = string.Empty;
    public DateTime DateFacture { get; set; }
}
