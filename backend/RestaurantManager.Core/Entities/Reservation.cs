using RestaurantManager.Core.Enums;

namespace RestaurantManager.Core.Entities;

public class Reservation
{
    public int IdReservation { get; set; }
    public int IdTable { get; set; }
    public int IdClient { get; set; }
    public int NombrePersonne { get; set; }
    public DateTime DateHeureDebut { get; set; }
    public DateTime DateHeureFin { get; set; }
    public StatutReservation Statut { get; set; }
    public string? Notes { get; set; }
}
