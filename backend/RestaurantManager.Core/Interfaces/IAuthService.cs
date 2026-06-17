using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.Interfaces;

public interface IAuthService
{
    LoginResponse Login(string pin);
}
