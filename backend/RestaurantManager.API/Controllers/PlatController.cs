using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize]
[Route("api/plats")]
public class PlatController : ControllerBase
{
    private readonly IPlatUseCases _platUseCases;

    public PlatController(IPlatUseCases platUseCases)
    {
        _platUseCases = platUseCases;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_platUseCases.GetAll());
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        return Ok(_platUseCases.GetById(id));
    }

    [HttpPost]
    public IActionResult Create([FromBody] PlatCreateDto plat)
    {
        var cree = _platUseCases.Create(plat);
        return CreatedAtAction(nameof(GetById), new { id = cree.IdPlat }, cree);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] PlatUpdateDto plat)
    {
        _platUseCases.Update(id, plat);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        _platUseCases.Delete(id);
        return NoContent();
    }
}
