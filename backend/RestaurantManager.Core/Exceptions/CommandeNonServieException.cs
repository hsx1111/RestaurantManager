namespace RestaurantManager.Core.Exceptions;

public class CommandeNonServieException : Exception
{
    public CommandeNonServieException()
        : base("La commande doit être préparée et servie par la cuisine avant de pouvoir clôturer la table.")
    {
    }
}
