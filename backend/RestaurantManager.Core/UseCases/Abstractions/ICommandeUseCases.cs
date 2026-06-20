using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface ICommandeUseCases
{
    CommandeDetailDto Create(CommandeCreateDto commande, int idUtilisateur);
    CommandeDetailDto? GetById(int id);
    CommandeDetailDto? GetEnCoursParTable(int idTable);
    CommandeDetailDto AjouterLignes(int idCommande, List<LigneCreateDto> lignes);
    FactureDto Cloturer(int idCommande, string modePaiement);
}
