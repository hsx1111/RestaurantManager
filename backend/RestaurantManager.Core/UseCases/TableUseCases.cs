using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Interfaces;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.Core.UseCases;

public class TableUseCases : ITableUseCases
{
    private readonly ITableRepository _tableRepository;

    public TableUseCases(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    public IEnumerable<TableDto> GetAll()
    {
        return _tableRepository.GetAll();
    }
}
