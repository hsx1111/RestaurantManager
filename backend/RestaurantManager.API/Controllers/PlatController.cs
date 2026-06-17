using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Exceptions;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize]
[Route("api/plats")]
public class PlatController : ControllerBase
{
    private readonly IPlatRepository _platRepository;

    public PlatController(IPlatRepository platRepository)
    {
        _platRepository = platRepository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_platRepository.GetAllAvecCategorie());
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        try
        {
            return Ok(_platRepository.GetById(id));
        }
        catch (PlatNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost]
    public IActionResult Create([FromBody] PlatCreateDto plat)
    {
        try
        {
            var id = _platRepository.Add(plat);
            return CreatedAtAction(nameof(GetById), new { id }, _platRepository.GetById(id));
        }
        catch (CategorieNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] PlatUpdateDto plat)
    {
        try
        {
            _platRepository.Update(id, plat);
            return NoContent();
        }
        catch (PlatNotFoundException)
        {
            return NotFound();
        }
        catch (CategorieNotFoundException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        try
        {
            _platRepository.Delete(id);
            return NoContent();
        }
        catch (PlatNotFoundException)
        {
            return NotFound();
        }
    }
}
