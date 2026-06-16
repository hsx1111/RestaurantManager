namespace RestaurantManager.Core.Entities;

public class Client
{
    public int IdClient { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string? Telephone { get; set; }
    public string? Email { get; set; }
    public DateTime DateInscription { get; set; }
}
