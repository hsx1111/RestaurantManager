namespace RestaurantManager.Core.DTOs;

public class UtilisateurCreateDto
{
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Pin { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
