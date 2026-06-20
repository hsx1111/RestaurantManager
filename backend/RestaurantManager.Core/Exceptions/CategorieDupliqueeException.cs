namespace RestaurantManager.Core.Exceptions;

public class CategorieDupliqueeException : Exception
{
    public CategorieDupliqueeException()
        : base("Une catégorie portant ce nom existe déjà.")
    {
    }
}
