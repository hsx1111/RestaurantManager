using System.Text.RegularExpressions;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Enums;
using RestaurantManager.Core.Exceptions;
using RestaurantManager.Core.Interfaces;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.Core.UseCases;

public class UtilisateurUseCases : IUtilisateurUseCases
{
    private readonly IUtilisateurRepository _utilisateurRepository;

    public UtilisateurUseCases(IUtilisateurRepository utilisateurRepository)
    {
        _utilisateurRepository = utilisateurRepository;
    }

    public IEnumerable<UtilisateurDto> GetAll()
    {
        return _utilisateurRepository.GetAll();
    }

    public UtilisateurDto GetById(int id)
    {
        return _utilisateurRepository.GetById(id)
            ?? throw new UtilisateurNotFoundException(id);
    }

    public UtilisateurDto Create(UtilisateurCreateDto utilisateur)
    {
        ValiderChamps(utilisateur.Nom, utilisateur.Prenom, utilisateur.Role);
        ValiderPin(utilisateur.Pin);

        var id = _utilisateurRepository.Add(utilisateur);
        return _utilisateurRepository.GetById(id)!;
    }

    public void Update(int id, UtilisateurUpdateDto utilisateur)
    {
        ValiderChamps(utilisateur.Nom, utilisateur.Prenom, utilisateur.Role);
        if (!string.IsNullOrWhiteSpace(utilisateur.Pin))
        {
            ValiderPin(utilisateur.Pin);
        }

        var lignesAffectees = _utilisateurRepository.Update(id, utilisateur);
        if (lignesAffectees == 0)
        {
            throw new UtilisateurNotFoundException(id);
        }
    }

    public void Delete(int id)
    {
        var lignesAffectees = _utilisateurRepository.Delete(id);
        if (lignesAffectees == 0)
        {
            throw new UtilisateurNotFoundException(id);
        }
    }

    private static void ValiderChamps(string nom, string prenom, string role)
    {
        if (string.IsNullOrWhiteSpace(nom) || string.IsNullOrWhiteSpace(prenom))
        {
            throw new ArgumentException("Le nom et le prénom sont requis.");
        }
        if (!Enum.TryParse<Role>(role, out _))
        {
            throw new ArgumentException("Rôle invalide.");
        }
    }

    private static void ValiderPin(string? pin)
    {
        if (pin is null || !Regex.IsMatch(pin, "^[0-9]{4}$"))
        {
            throw new ArgumentException("Le code PIN doit comporter exactement 4 chiffres.");
        }
    }
}
