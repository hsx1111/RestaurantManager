using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Interfaces;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.Core.UseCases;

public class ClientUseCases : IClientUseCases
{
    private readonly IClientRepository _clientRepository;

    public ClientUseCases(IClientRepository clientRepository)
    {
        _clientRepository = clientRepository;
    }

    public IEnumerable<ClientDto> GetAll()
    {
        return _clientRepository.GetAll();
    }

    public ClientDto Create(ClientCreateDto client)
    {
        if (string.IsNullOrWhiteSpace(client.Nom) || string.IsNullOrWhiteSpace(client.Prenom))
        {
            throw new ArgumentException("Le nom et le prénom du client sont requis.");
        }

        var id = _clientRepository.Add(client);
        return new ClientDto { Id = id, Nom = client.Nom, Prenom = client.Prenom };
    }
}
