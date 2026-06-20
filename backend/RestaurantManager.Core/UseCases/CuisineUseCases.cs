using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Interfaces;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.Core.UseCases;

public class CuisineUseCases : ICuisineUseCases
{
    private readonly ICommandeRepository _commandeRepository;

    public CuisineUseCases(ICommandeRepository commandeRepository)
    {
        _commandeRepository = commandeRepository;
    }

    public List<TicketCuisineDto> GetTickets()
    {
        return _commandeRepository.GetTicketsEnCours();
    }

    public void MarquerLignePrete(int idDetail)
    {
        _commandeRepository.MarquerLignePrete(idDetail);
    }

    public void MarquerCommandeServie(int idCommande)
    {
        _commandeRepository.MarquerCommandeServie(idCommande);
    }
}
