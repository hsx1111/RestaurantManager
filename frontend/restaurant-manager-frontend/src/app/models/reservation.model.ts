export type StatutReservation = 'EnAttente' | 'Confirmee' | 'Honoree' | 'Annulee';

export interface Reservation {
  id: number;
  idTable: number;
  numeroTable: number;
  idClient: number;
  nomClient: string;
  nombrePersonne: number;
  dateHeureDebut: string;
  dateHeureFin: string;
  statut: StatutReservation;
  notes?: string | null;
}

export interface ReservationCreate {
  idTable: number;
  idClient: number;
  nombrePersonne: number;
  dateHeureDebut: string;
  dateHeureFin: string;
  notes?: string | null;
}

export interface ReservationUpdate {
  idTable: number;
  idClient: number;
  nombrePersonne: number;
  dateHeureDebut: string;
  dateHeureFin: string;
  statut: StatutReservation;
  notes?: string | null;
}
