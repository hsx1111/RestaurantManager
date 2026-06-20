using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.Interfaces;

public interface IClientRepository
{
    IEnumerable<ClientDto> GetAll();
    int Add(ClientCreateDto client);
}
