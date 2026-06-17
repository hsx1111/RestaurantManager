namespace RestaurantManager.Core.Exceptions;

public class CategorieEnUsageException : Exception
{
    public CategorieEnUsageException()
        : base("Cette catégorie contient des plats")
    {
    }
}
