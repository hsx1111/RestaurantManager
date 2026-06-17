namespace RestaurantManager.Core.DTOs;

public class PlatDto
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Prix { get; set; }
    public int IdCategorie { get; set; }
    public string NomCategorie { get; set; } = string.Empty;
}
