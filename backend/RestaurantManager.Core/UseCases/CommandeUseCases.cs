using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Interfaces;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.Core.UseCases;

public class CommandeUseCases : ICommandeUseCases
{
    private readonly ICommandeRepository _commandeRepository;

    public CommandeUseCases(ICommandeRepository commandeRepository)
    {
        _commandeRepository = commandeRepository;
    }

    public CommandeDetailDto Create(CommandeCreateDto commande, int idUtilisateur)
    {
        if (commande.Lignes.Count == 0)
        {
            throw new ArgumentException("La commande doit contenir au moins un plat.");
        }

        var id = _commandeRepository.Create(commande, idUtilisateur);
        return _commandeRepository.GetById(id)!;
    }

    public CommandeDetailDto? GetById(int id)
    {
        return _commandeRepository.GetById(id);
    }
}
