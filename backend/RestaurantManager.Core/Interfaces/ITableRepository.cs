using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.Interfaces;

public interface ITableRepository
{
    IEnumerable<TableDto> GetAll();
    TableDto? GetById(int id);
    int Add(TableCreateDto table);
    int Update(int id, TableUpdateDto table);
    int Delete(int id);
}
