using RestaurantManager.Core.Enums;

namespace RestaurantManager.Core.Entities;

public class Utilisateur
{
    public int IdUtilisateur { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public Role Role { get; set; }
}
