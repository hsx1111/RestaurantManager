namespace RestaurantManager.Core.Exceptions;

public class ReservationNotFoundException : Exception
{
    public ReservationNotFoundException(int idReservation)
        : base($"Réservation {idReservation} introuvable.")
    {
    }
}
