using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface ITableUseCases
{
    IEnumerable<TableDto> GetAll();
    TableDto GetById(int id);
    TableDto Create(TableCreateDto table);
    void Update(int id, TableUpdateDto table);
    void Delete(int id);
}
