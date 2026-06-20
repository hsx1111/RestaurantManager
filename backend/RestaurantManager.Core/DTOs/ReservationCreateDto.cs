namespace RestaurantManager.Core.DTOs;

public class ReservationCreateDto
{
    public int IdTable { get; set; }
    public int IdClient { get; set; }
    public int NombrePersonne { get; set; }
    public DateTime DateHeureDebut { get; set; }
    public DateTime DateHeureFin { get; set; }
    public string? Notes { get; set; }
}
