namespace RestaurantManager.Core.DTOs;

public class CommandeCreateDto
{
    public int? IdClient { get; set; }
    public int IdTable { get; set; }
    public List<LigneCreateDto> Lignes { get; set; } = new();
}
