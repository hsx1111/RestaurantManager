using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.Entities;
using RestaurantManager.Core.Exceptions;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize]
[Route("api/categories")]
public class CategorieController : ControllerBase
{
    private readonly ICategorieService _categorieService;

    public CategorieController(ICategorieService categorieService)
    {
        _categorieService = categorieService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_categorieService.GetAll());
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        try
        {
            return Ok(_categorieService.GetById(id));
        }
        catch (CategorieNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    public IActionResult Create([FromBody] Categorie categorie)
    {
        var creee = _categorieService.Create(categorie);
        return CreatedAtAction(nameof(GetById), new { id = creee.IdCategorie }, creee);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] Categorie categorie)
    {
        categorie.IdCategorie = id;
        try
        {
            _categorieService.Update(categorie);
            return NoContent();
        }
        catch (CategorieNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        try
        {
            _categorieService.Delete(id);
            return NoContent();
        }
        catch (CategorieEnUsageException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (CategorieNotFoundException)
        {
            return NotFound();
        }
    }
}
