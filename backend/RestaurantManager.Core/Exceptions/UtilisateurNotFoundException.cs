namespace RestaurantManager.Core.Exceptions;

public class UtilisateurNotFoundException : Exception
{
    public UtilisateurNotFoundException(int idUtilisateur)
        : base($"Utilisateur {idUtilisateur} introuvable.")
    {
    }
}
