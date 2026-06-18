namespace RestaurantManager.Core.DTOs;

public class TicketCuisineDto
{
    public int IdCommande { get; set; }
    public int NumeroTable { get; set; }
    public string NomServeur { get; set; } = string.Empty;
    public DateTime DateEnvoi { get; set; }
    public List<LigneTicketDto> Lignes { get; set; } = new();
}
