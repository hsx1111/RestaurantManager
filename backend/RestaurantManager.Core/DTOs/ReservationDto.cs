namespace RestaurantManager.Core.DTOs;

public class ReservationDto
{
    public int Id { get; set; }
    public int IdTable { get; set; }
    public int NumeroTable { get; set; }
    public int IdClient { get; set; }
    public string NomClient { get; set; } = string.Empty;
    public int NombrePersonne { get; set; }
    public DateTime DateHeureDebut { get; set; }
    public DateTime DateHeureFin { get; set; }
    public string Statut { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
