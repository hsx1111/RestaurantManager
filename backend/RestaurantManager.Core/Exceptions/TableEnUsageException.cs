namespace RestaurantManager.Core.Exceptions;

public class TableEnUsageException : Exception
{
    public TableEnUsageException()
        : base("Cette table est en cours d'utilisation.")
    {
    }
}
