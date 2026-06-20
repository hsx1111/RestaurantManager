using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize(Roles = "Cuisine,Gestionnaire")]
[Route("api/cuisine")]
public class CuisineController : ControllerBase
{
    private readonly ICuisineUseCases _cuisineUseCases;

    public CuisineController(ICuisineUseCases cuisineUseCases)
    {
        _cuisineUseCases = cuisineUseCases;
    }

    [HttpGet("tickets")]
    public IActionResult GetTickets()
    {
        return Ok(_cuisineUseCases.GetTickets());
    }

    [HttpPatch("lignes/{idDetail:int}/prepare")]
    public IActionResult MarquerLignePrete(int idDetail)
    {
        _cuisineUseCases.MarquerLignePrete(idDetail);
        return NoContent();
    }

    [HttpPost("commandes/{idCommande:int}/servie")]
    public IActionResult MarquerCommandeServie(int idCommande)
    {
        _cuisineUseCases.MarquerCommandeServie(idCommande);
        return NoContent();
    }
}
