using RestaurantManager.Core.Models;

namespace RestaurantManager.Core.Interfaces;

public interface IUtilisateurRepository
{
    Utilisateur? GetByPin(string pinPlain);
}
