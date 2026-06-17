using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Exceptions;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.Core.Services;

public class AuthService : IAuthService
{
    private readonly IUtilisateurRepository _utilisateurRepository;

    public AuthService(IUtilisateurRepository utilisateurRepository)
    {
        _utilisateurRepository = utilisateurRepository;
    }

    public LoginResponse Login(string pin)
    {
        var utilisateur = _utilisateurRepository.GetByPin(pin);
        if (utilisateur is null)
        {
            throw new PinInvalidException();
        }

        return new LoginResponse
        {
            IdUtilisateur = utilisateur.IdUtilisateur,
            Nom = utilisateur.Nom,
            Prenom = utilisateur.Prenom,
            Role = utilisateur.Role.ToString()
        };
    }
}
