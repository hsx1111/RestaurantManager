using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize(Roles = "Serveur,Gestionnaire")]
[Route("api/reservations")]
public class ReservationController : ControllerBase
{
    private readonly IReservationUseCases _reservationUseCases;

    public ReservationController(IReservationUseCases reservationUseCases)
    {
        _reservationUseCases = reservationUseCases;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_reservationUseCases.GetAll());
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        return Ok(_reservationUseCases.GetById(id));
    }

    [HttpPost]
    public IActionResult Create([FromBody] ReservationCreateDto reservation)
    {
        var creee = _reservationUseCases.Create(reservation);
        return CreatedAtAction(nameof(GetById), new { id = creee.Id }, creee);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] ReservationUpdateDto reservation)
    {
        _reservationUseCases.Update(id, reservation);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        _reservationUseCases.Delete(id);
        return NoContent();
    }
}
