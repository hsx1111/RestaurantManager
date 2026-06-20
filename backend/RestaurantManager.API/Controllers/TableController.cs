using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize]
[Route("api/tables")]
public class TableController : ControllerBase
{
    private readonly ITableUseCases _tableUseCases;

    public TableController(ITableUseCases tableUseCases)
    {
        _tableUseCases = tableUseCases;
    }

    [HttpGet]
    [Authorize(Roles = "Serveur,Gestionnaire")]
    public IActionResult GetAll()
    {
        return Ok(_tableUseCases.GetAll());
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public IActionResult GetById(int id)
    {
        return Ok(_tableUseCases.GetById(id));
    }

    [HttpPost]
    [Authorize(Roles = "Gestionnaire")]
    public IActionResult Create([FromBody] TableCreateDto table)
    {
        var creee = _tableUseCases.Create(table);
        return CreatedAtAction(nameof(GetById), new { id = creee.Id }, creee);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public IActionResult Update(int id, [FromBody] TableUpdateDto table)
    {
        _tableUseCases.Update(id, table);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Gestionnaire")]
    public IActionResult Delete(int id)
    {
        _tableUseCases.Delete(id);
        return NoContent();
    }
}
