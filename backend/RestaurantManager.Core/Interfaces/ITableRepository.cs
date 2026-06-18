using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.Interfaces;

public interface ITableRepository
{
    IEnumerable<TableDto> GetAll();
}
