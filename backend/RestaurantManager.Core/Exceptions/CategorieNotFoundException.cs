namespace RestaurantManager.Core.Exceptions;

public class CategorieNotFoundException : Exception
{
    public CategorieNotFoundException(int idCategorie)
        : base($"Catégorie {idCategorie} introuvable.")
    {
    }
}
