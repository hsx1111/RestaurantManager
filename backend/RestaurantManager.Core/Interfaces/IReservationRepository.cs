using RestaurantManager.Core.DTOs;

namespace RestaurantManager.Core.Interfaces;

public interface IReservationRepository
{
    IEnumerable<ReservationDto> GetAll();
    ReservationDto? GetById(int id);
    int Add(ReservationCreateDto reservation);
    int Update(int id, ReservationUpdateDto reservation);
    int Delete(int id);
}
