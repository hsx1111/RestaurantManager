using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public IActionResult GetAll()
    {
        return Ok(_tableUseCases.GetAll());
    }
}
