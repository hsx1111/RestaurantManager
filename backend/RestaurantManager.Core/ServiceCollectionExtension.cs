using Microsoft.Extensions.DependencyInjection;
using RestaurantManager.Core.UseCases;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.Core;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddCoreServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthUseCases, AuthUseCases>();
        services.AddScoped<ICategorieUseCases, CategorieUseCases>();
        services.AddScoped<IPlatUseCases, PlatUseCases>();
        services.AddScoped<ICommandeUseCases, CommandeUseCases>();
        services.AddScoped<ICuisineUseCases, CuisineUseCases>();
        services.AddScoped<ITableUseCases, TableUseCases>();
        services.AddScoped<IUtilisateurUseCases, UtilisateurUseCases>();
        return services;
    }
}
