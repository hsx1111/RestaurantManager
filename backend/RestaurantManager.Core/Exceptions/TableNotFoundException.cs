namespace RestaurantManager.Core.Exceptions;

public class TableNotFoundException : Exception
{
    public TableNotFoundException(int idTable)
        : base($"Table {idTable} introuvable.")
    {
    }
}
