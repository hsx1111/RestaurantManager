namespace RestaurantManager.Core.Exceptions;

public class ReservationChevauchementException : Exception
{
    public ReservationChevauchementException()
        : base("La table est déjà réservée sur ce créneau.")
    {
    }
}
