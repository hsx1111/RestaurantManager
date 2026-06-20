namespace RestaurantManager.Core.DTOs;

public class UtilisateurDto
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
