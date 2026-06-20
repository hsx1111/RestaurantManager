using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.Models;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize]
[Route("api/categories")]
public class CategorieController : ControllerBase
{
    private readonly ICategorieUseCases _categorieUseCases;

    public CategorieController(ICategorieUseCases categorieUseCases)
    {
        _categorieUseCases = categorieUseCases;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_categorieUseCases.GetAll());
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        return Ok(_categorieUseCases.GetById(id));
    }

    [HttpPost]
    public IActionResult Create([FromBody] Categorie categorie)
    {
        var creee = _categorieUseCases.Create(categorie);
        return CreatedAtAction(nameof(GetById), new { id = creee.IdCategorie }, creee);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] Categorie categorie)
    {
        categorie.IdCategorie = id;
        _categorieUseCases.Update(categorie);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        _categorieUseCases.Delete(id);
        return NoContent();
    }
}
