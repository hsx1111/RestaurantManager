using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize(Roles = "Cuisine,Gestionnaire")]
[Route("api/cuisine")]
public class CuisineController : ControllerBase
{
    private readonly ICommandeRepository _commandeRepository;

    public CuisineController(ICommandeRepository commandeRepository)
    {
        _commandeRepository = commandeRepository;
    }

    [HttpGet("tickets")]
    public IActionResult GetTickets()
    {
        return Ok(_commandeRepository.GetTicketsEnCours());
    }

    [HttpPatch("lignes/{idDetail:int}/prepare")]
    public IActionResult MarquerLignePrete(int idDetail)
    {
        _commandeRepository.MarquerLignePrete(idDetail);
        return NoContent();
    }

    [HttpPost("commandes/{idCommande:int}/servie")]
    public IActionResult MarquerCommandeServie(int idCommande)
    {
        _commandeRepository.MarquerCommandeServie(idCommande);
        return NoContent();
    }
}
