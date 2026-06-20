using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface IUtilisateurUseCases
{
    IEnumerable<UtilisateurDto> GetAll();
    UtilisateurDto GetById(int id);
    UtilisateurDto Create(UtilisateurCreateDto utilisateur);
    void Update(int id, UtilisateurUpdateDto utilisateur);
    void Delete(int id);
}
