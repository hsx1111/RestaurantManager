using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Authorize]
[Route("api/tables")]
public class TableController : ControllerBase
{
    private readonly ITableRepository _tableRepository;

    public TableController(ITableRepository tableRepository)
    {
        _tableRepository = tableRepository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_tableRepository.GetAll());
    }
}
