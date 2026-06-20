using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Models;

namespace RestaurantManager.Core.Interfaces;

public interface IUtilisateurRepository
{
    Utilisateur? GetByPin(string pinPlain);
    IEnumerable<UtilisateurDto> GetAll();
    UtilisateurDto? GetById(int id);
    int Add(UtilisateurCreateDto utilisateur);
    int Update(int id, UtilisateurUpdateDto utilisateur);
    int Delete(int id);
}
