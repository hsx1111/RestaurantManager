namespace RestaurantManager.Core.Exceptions;

public class PlatNotFoundException : Exception
{
    public PlatNotFoundException(int idPlat)
        : base($"Plat {idPlat} introuvable.")
    {
    }
}
