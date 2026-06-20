using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize]
[Route("api/commandes")]
public class CommandeController : ControllerBase
{
    private readonly ICommandeUseCases _commandeUseCases;

    public CommandeController(ICommandeUseCases commandeUseCases)
    {
        _commandeUseCases = commandeUseCases;
    }

    [HttpPost]
    public IActionResult Create([FromBody] CommandeCreateDto commande)
    {
        var idUtilisateur = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var detail = _commandeUseCases.Create(commande, idUtilisateur);
        return CreatedAtAction(nameof(GetById), new { id = detail.Id }, detail);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var commande = _commandeUseCases.GetById(id);
        return commande is null ? NotFound() : Ok(commande);
    }
}
