using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize(Roles = "Serveur,Gestionnaire")]
[Route("api/clients")]
public class ClientController : ControllerBase
{
    private readonly IClientUseCases _clientUseCases;

    public ClientController(IClientUseCases clientUseCases)
    {
        _clientUseCases = clientUseCases;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_clientUseCases.GetAll());
    }

    [HttpPost]
    public IActionResult Create([FromBody] ClientCreateDto client)
    {
        var cree = _clientUseCases.Create(client);
        return Created($"/api/clients/{cree.Id}", cree);
    }
}
