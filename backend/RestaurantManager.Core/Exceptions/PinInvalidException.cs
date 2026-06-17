namespace RestaurantManager.Core.Exceptions;

public class PinInvalidException : Exception
{
    public PinInvalidException() : base("Code PIN invalide")
    {
    }
}
