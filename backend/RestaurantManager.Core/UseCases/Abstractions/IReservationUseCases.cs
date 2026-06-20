using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.UseCases.Abstractions;

public interface IReservationUseCases
{
    IEnumerable<ReservationDto> GetAll();
    ReservationDto GetById(int id);
    ReservationDto Create(ReservationCreateDto reservation);
    void Update(int id, ReservationUpdateDto reservation);
    void Delete(int id);
}
