namespace RestaurantManager.Core.DTOs;

public class ClientCreateDto
{
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string? Telephone { get; set; }
    public string? Email { get; set; }
}
