using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface IAuthUseCases
{
    LoginResponse Login(string pin);
}
