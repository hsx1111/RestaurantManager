using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize(Roles = "Gestionnaire")]
[Route("api/utilisateurs")]
public class UtilisateurController : ControllerBase
{
    private readonly IUtilisateurUseCases _utilisateurUseCases;

    public UtilisateurController(IUtilisateurUseCases utilisateurUseCases)
    {
        _utilisateurUseCases = utilisateurUseCases;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_utilisateurUseCases.GetAll());
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        return Ok(_utilisateurUseCases.GetById(id));
    }

    [HttpPost]
    public IActionResult Create([FromBody] UtilisateurCreateDto utilisateur)
    {
        var cree = _utilisateurUseCases.Create(utilisateur);
        return CreatedAtAction(nameof(GetById), new { id = cree.Id }, cree);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] UtilisateurUpdateDto utilisateur)
    {
        _utilisateurUseCases.Update(id, utilisateur);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        _utilisateurUseCases.Delete(id);
        return NoContent();
    }
}
