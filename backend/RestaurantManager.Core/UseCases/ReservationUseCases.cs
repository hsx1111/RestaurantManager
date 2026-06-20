using RestaurantManager.Core.DTOs;
using RestaurantManager.Core.Enums;
using RestaurantManager.Core.Exceptions;
using RestaurantManager.Core.Interfaces;
using RestaurantManager.Core.UseCases.Abstractions;

namespace RestaurantManager.Core.UseCases;

public class ReservationUseCases : IReservationUseCases
{
    private readonly IReservationRepository _reservationRepository;

    public ReservationUseCases(IReservationRepository reservationRepository)
    {
        _reservationRepository = reservationRepository;
    }

    public IEnumerable<ReservationDto> GetAll()
    {
        return _reservationRepository.GetAll();
    }

    public ReservationDto GetById(int id)
    {
        return _reservationRepository.GetById(id)
            ?? throw new ReservationNotFoundException(id);
    }

    public ReservationDto Create(ReservationCreateDto reservation)
    {
        ValiderPeriode(reservation.DateHeureDebut, reservation.DateHeureFin);
        ValiderPersonnes(reservation.NombrePersonne);

        var id = _reservationRepository.Add(reservation);
        return _reservationRepository.GetById(id)!;
    }

    public void Update(int id, ReservationUpdateDto reservation)
    {
        ValiderPeriode(reservation.DateHeureDebut, reservation.DateHeureFin);
        ValiderPersonnes(reservation.NombrePersonne);
        if (!Enum.TryParse<StatutReservation>(reservation.Statut, out _))
        {
            throw new ArgumentException("Statut de réservation invalide.");
        }

        var lignesAffectees = _reservationRepository.Update(id, reservation);
        if (lignesAffectees == 0)
        {
            throw new ReservationNotFoundException(id);
        }
    }

    public void Delete(int id)
    {
        var lignesAffectees = _reservationRepository.Delete(id);
        if (lignesAffectees == 0)
        {
            throw new ReservationNotFoundException(id);
        }
    }

    private static void ValiderPeriode(DateTime debut, DateTime fin)
    {
        if (fin <= debut)
        {
            throw new ArgumentException("La date de fin doit être postérieure à la date de début.");
        }
    }

    private static void ValiderPersonnes(int nombrePersonne)
    {
        if (nombrePersonne <= 0)
        {
            throw new ArgumentException("Le nombre de personnes doit être supérieur à 0.");
        }
    }
}
