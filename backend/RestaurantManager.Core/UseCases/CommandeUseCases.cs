using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Enums;
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

    public CommandeDetailDto? GetEnCoursParTable(int idTable)
    {
        return _commandeRepository.GetCommandeEnCoursParTable(idTable);
    }

    public CommandeDetailDto AjouterLignes(int idCommande, List<LigneCreateDto> lignes)
    {
        if (lignes.Count == 0)
        {
            throw new ArgumentException("Aucun plat à ajouter.");
        }

        _commandeRepository.AjouterLignes(idCommande, lignes);
        return _commandeRepository.GetById(idCommande)!;
    }

    public FactureDto Cloturer(int idCommande, string modePaiement)
    {
        if (!Enum.TryParse<ModePaiement>(modePaiement, out _))
        {
            throw new ArgumentException("Mode de paiement invalide.");
        }

        return _commandeRepository.Cloturer(idCommande, modePaiement);
    }
}
