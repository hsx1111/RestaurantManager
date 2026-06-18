namespace RestaurantManager.Core.DTOs;

public class LigneTicketDto
{
    public int IdDetail { get; set; }
    public string NomPlat { get; set; } = string.Empty;
    public int Quantite { get; set; }
    public bool Prepare { get; set; }
}
