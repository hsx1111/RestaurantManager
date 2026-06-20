using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Interfaces;
using RestaurantManager.Core.Models;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.Core.UseCases;

public class PlatUseCases : IPlatUseCases
{
    private readonly IPlatRepository _platRepository;

    public PlatUseCases(IPlatRepository platRepository)
    {
        _platRepository = platRepository;
    }

    public IEnumerable<PlatDto> GetAll()
    {
        return _platRepository.GetAllAvecCategorie();
    }

    public Plat GetById(int id)
    {
        return _platRepository.GetById(id);
    }

    public Plat Create(PlatCreateDto plat)
    {
        var id = _platRepository.Add(plat);
        return _platRepository.GetById(id);
    }

    public void Update(int id, PlatUpdateDto plat)
    {
        _platRepository.Update(id, plat);
    }

    public void Delete(int id)
    {
        _platRepository.Delete(id);
    }
}
