using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.Interfaces;

public interface ICommandeRepository
{
    int Create(CommandeCreateDto commande, int idUtilisateur);
    CommandeDetailDto? GetById(int id);
}
