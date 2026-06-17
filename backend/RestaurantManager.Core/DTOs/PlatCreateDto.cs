namespace RestaurantManager.Core.DTOs;

public class PlatCreateDto
{
    public string Nom { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Prix { get; set; }
    public int IdCategorie { get; set; }
}
