using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.Interfaces;

public interface ICommandeRepository
{
    int Create(CommandeCreateDto commande, int idUtilisateur);
    CommandeDetailDto? GetById(int id);
    CommandeDetailDto? GetCommandeActiveParTable(int idTable);
    void AjouterLignes(int idCommande, IEnumerable<LigneCreateDto> lignes);
    FactureDto Cloturer(int idCommande, string modePaiement);
    List<TicketCuisineDto> GetTicketsEnCours();
    void MarquerLignePrete(int idDetail);
    void MarquerCommandeServie(int idCommande);
}
