using Microsoft.Extensions.DependencyInjection;
using RestaurantManager.Core.Interfaces;
using RestaurantManager.Infrastructure.Repositories;

namespace RestaurantManager.Infrastructure;

public static class ServiceCollectionExtension
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<IUtilisateurRepository, UtilisateurRepository>();
        services.AddScoped<ICategorieRepository, CategorieRepository>();
        services.AddScoped<IPlatRepository, PlatRepository>();
        services.AddScoped<ITableRepository, TableRepository>();
        services.AddScoped<ICommandeRepository, CommandeRepository>();
        services.AddScoped<IReservationRepository, ReservationRepository>();
        services.AddScoped<IClientRepository, ClientRepository>();
        services.AddScoped<IFactureRepository, FactureRepository>();
        return services;
    }
}
