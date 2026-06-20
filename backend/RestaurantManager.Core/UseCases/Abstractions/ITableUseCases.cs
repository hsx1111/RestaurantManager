using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface ITableUseCases
{
    IEnumerable<TableDto> GetAll();
}
