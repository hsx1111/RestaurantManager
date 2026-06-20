namespace RestaurantManager.Core.DTOs;

public class UtilisateurUpdateDto
{
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Pin { get; set; }
}
