namespace RestaurantManager.Core.DTOs;

public class CommandeDetailDto
{
    public int Id { get; set; }
    public int NumeroTable { get; set; }
    public string NomServeur { get; set; } = string.Empty;
    public List<LigneDetailDto> Lignes { get; set; } = new();
    public decimal Total { get; set; }
}
