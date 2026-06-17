using RestaurantManager.Core.Entities;

namespace RestaurantManager.Core.Interfaces;

public interface IUtilisateurRepository
{
    Utilisateur? GetByPin(string pinPlain);
}
