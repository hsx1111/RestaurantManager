using System.Text.Encodings.Web;
using System.Text.Json;
using RestaurantManager.Core.Exceptions;

namespace RestaurantManager.API.Middleware;

public class GlobalExceptionHandlerMiddleware
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    };

    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            var statusCode = exception switch
            {
                PinInvalidException => StatusCodes.Status401Unauthorized,
                CategorieNotFoundException or PlatNotFoundException or UtilisateurNotFoundException
                    or TableNotFoundException or ReservationNotFoundException => StatusCodes.Status404NotFound,
                CategorieEnUsageException or TableEnUsageException or ReservationChevauchementException
                    or CategorieDupliqueeException or CommandeNonServieException => StatusCodes.Status409Conflict,
                ArgumentException => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError
            };

            if (statusCode == StatusCodes.Status500InternalServerError)
            {
                _logger.LogError(exception, "Erreur non gérée");
            }

            var message = statusCode == StatusCodes.Status500InternalServerError
                ? "Une erreur interne est survenue."
                : exception.Message;

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { message }, JsonOptions));
        }
    }
}
