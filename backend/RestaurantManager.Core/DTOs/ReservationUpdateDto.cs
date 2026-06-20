namespace RestaurantManager.Core.DTOs;

public class ReservationUpdateDto
{
    public int IdTable { get; set; }
    public int IdClient { get; set; }
    public int NombrePersonne { get; set; }
    public DateTime DateHeureDebut { get; set; }
    public DateTime DateHeureFin { get; set; }
    public string Statut { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
