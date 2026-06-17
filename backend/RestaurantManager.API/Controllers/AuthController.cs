using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Exceptions;
using RestaurantManager.Core.Interfaces;

namespace RestaurantManager.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        LoginResponse utilisateur;
        try
        {
            utilisateur = _authService.Login(request.Pin);
        }
        catch (PinInvalidException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, utilisateur.IdUtilisateur.ToString()),
            new(ClaimTypes.Name, $"{utilisateur.Prenom} {utilisateur.Nom}"),
            new(ClaimTypes.Role, utilisateur.Role),
            new("prenom", utilisateur.Prenom),
            new("nom", utilisateur.Nom)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

        return Ok(utilisateur);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var utilisateur = new LoginResponse
        {
            IdUtilisateur = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
            Prenom = User.FindFirstValue("prenom") ?? string.Empty,
            Nom = User.FindFirstValue("nom") ?? string.Empty,
            Role = User.FindFirstValue(ClaimTypes.Role) ?? string.Empty
        };

        return Ok(utilisateur);
    }
}
