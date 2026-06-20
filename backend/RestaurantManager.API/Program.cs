using Microsoft.AspNetCore.Authentication.Cookies;
using RestaurantManager.API.Middleware;
using RestaurantManager.Core;
using RestaurantManager.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddCoreServices();
builder.Services.AddInfrastructureServices();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;

        // API consommée par Angular : on renvoie 401/403 au lieu de rediriger vers une page de login.
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Seed idempotent : ne s'exécute que sur une base vide
// Volontairement hors de IsDevelopment() pour garantir les comptes de démo
var seeder = new DataSeeder(app.Configuration);
seeder.Seed();

app.UseCors("AllowAngular");
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
