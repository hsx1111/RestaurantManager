using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Models;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface IPlatUseCases
{
    IEnumerable<PlatDto> GetAll();
    Plat GetById(int id);
    Plat Create(PlatCreateDto plat);
    void Update(int id, PlatUpdateDto plat);
    void Delete(int id);
}
