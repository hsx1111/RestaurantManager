using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize]
[Route("api/commandes")]
public class CommandeController : ControllerBase
{
    private readonly ICommandeRepository _commandeRepository;

    public CommandeController(ICommandeRepository commandeRepository)
    {
        _commandeRepository = commandeRepository;
    }

    [HttpPost]
    public IActionResult Create([FromBody] CommandeCreateDto commande)
    {
        var idUtilisateur = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var id = _commandeRepository.Create(commande, idUtilisateur);
        return CreatedAtAction(nameof(GetById), new { id }, _commandeRepository.GetById(id));
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var commande = _commandeRepository.GetById(id);
        return commande is null ? NotFound() : Ok(commande);
    }
}
