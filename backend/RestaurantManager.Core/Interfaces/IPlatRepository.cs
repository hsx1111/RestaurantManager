using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Models;

namespace RestaurantManager.Core.Interfaces;

public interface IPlatRepository
{
    int CountByCategorie(int idCategorie);
    IEnumerable<PlatDto> GetAllAvecCategorie();
    Plat GetById(int id);
    int Add(PlatCreateDto plat);
    void Update(int id, PlatUpdateDto plat);
    void Delete(int id);
}
