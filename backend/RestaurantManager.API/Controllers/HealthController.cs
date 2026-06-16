using Microsoft.AspNetCore.Mvc;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("API en ligne");
    }
}
