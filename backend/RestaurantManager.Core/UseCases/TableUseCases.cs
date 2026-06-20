using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Exceptions;
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

    public TableDto GetById(int id)
    {
        return _tableRepository.GetById(id)
            ?? throw new TableNotFoundException(id);
    }

    public TableDto Create(TableCreateDto table)
    {
        ValiderPlaces(table.NombrePlace);
        var id = _tableRepository.Add(table);
        return _tableRepository.GetById(id)!;
    }

    public void Update(int id, TableUpdateDto table)
    {
        ValiderPlaces(table.NombrePlace);
        var lignesAffectees = _tableRepository.Update(id, table);
        if (lignesAffectees == 0)
        {
            throw new TableNotFoundException(id);
        }
    }

    public void Delete(int id)
    {
        var lignesAffectees = _tableRepository.Delete(id);
        if (lignesAffectees == 0)
        {
            throw new TableNotFoundException(id);
        }
    }

    private static void ValiderPlaces(int nombrePlace)
    {
        if (nombrePlace <= 0)
        {
            throw new ArgumentException("Le nombre de places doit être supérieur à 0.");
        }
    }
}
