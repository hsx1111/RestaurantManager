using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface ICuisineUseCases
{
    List<TicketCuisineDto> GetTickets();
    void MarquerLignePrete(int idDetail);
    void MarquerCommandeServie(int idCommande);
}
