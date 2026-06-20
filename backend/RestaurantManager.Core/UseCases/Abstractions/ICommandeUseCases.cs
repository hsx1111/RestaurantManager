using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface ICommandeUseCases
{
    CommandeDetailDto Create(CommandeCreateDto commande, int idUtilisateur);
    CommandeDetailDto? GetById(int id);
}
