using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface IClientUseCases
{
    IEnumerable<ClientDto> GetAll();
    ClientDto Create(ClientCreateDto client);
}
