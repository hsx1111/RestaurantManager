using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize(Roles = "Serveur,Gestionnaire")]
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

    [HttpGet("table/{idTable:int}")]
    public IActionResult GetActiveParTable(int idTable)
    {
        var commande = _commandeUseCases.GetActiveParTable(idTable);
        return commande is null ? NotFound() : Ok(commande);
    }

    [HttpPost("{id:int}/lignes")]
    public IActionResult AjouterLignes(int id, [FromBody] List<LigneCreateDto> lignes)
    {
        return Ok(_commandeUseCases.AjouterLignes(id, lignes));
    }

    [HttpPost("{id:int}/cloturer")]
    public IActionResult Cloturer(int id, [FromBody] ClotureRequestDto requete)
    {
        return Ok(_commandeUseCases.Cloturer(id, requete.ModePaiement));
    }
}
