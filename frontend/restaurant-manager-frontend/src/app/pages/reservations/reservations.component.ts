import { Component, OnInit, inject, signal } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { ClientService } from '../../services/client.service';
import { TableService } from '../../services/table.service';
import { Reservation, ReservationCreate, StatutReservation } from '../../models/reservation.model';
import { Client } from '../../models/client.model';
import { Table } from '../../models/table.model';
import { ReservationFormComponent } from './reservation-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [ReservationFormComponent, ConfirmDialogComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent implements OnInit {
  private readonly reservationService = inject(ReservationService);
  private readonly clientService = inject(ClientService);
  private readonly tableService = inject(TableService);

  readonly reservations = signal<Reservation[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly tables = signal<Table[]>([]);
  readonly erreur = signal('');

  readonly formOuvert = signal(false);
  readonly confirmOuvert = signal(false);
  readonly aSupprimer = signal<Reservation | null>(null);

  ngOnInit(): void {
    this.charger();
    this.clientService.getAll().subscribe({ next: (liste) => this.clients.set(liste) });
    this.tableService.getAll().subscribe({ next: (liste) => this.tables.set(liste) });
  }

  private charger(): void {
    this.reservationService.getAll().subscribe({
      next: (liste) => this.reservations.set(liste),
      error: () => this.erreur.set('Impossible de charger les réservations.')
    });
  }

  ajouter(): void {
    this.erreur.set('');
    this.formOuvert.set(true);
  }

  fermerForm(): void {
    this.formOuvert.set(false);
  }

  enregistrer(donnees: ReservationCreate): void {
    this.reservationService.create(donnees).subscribe({
      next: () => {
        this.fermerForm();
        this.charger();
      },
      error: (err) => {
        this.fermerForm();
        this.erreur.set(err?.error?.message ?? 'Échec de la création de la réservation.');
      }
    });
  }

  confirmer(reservation: Reservation): void {
    this.majStatut(reservation, 'Confirmee');
  }

  annulerReservation(reservation: Reservation): void {
    this.majStatut(reservation, 'Annulee');
  }

  private majStatut(reservation: Reservation, statut: StatutReservation): void {
    this.erreur.set('');
    this.reservationService
      .update(reservation.id, {
        idTable: reservation.idTable,
        idClient: reservation.idClient,
        nombrePersonne: reservation.nombrePersonne,
        dateHeureDebut: reservation.dateHeureDebut,
        dateHeureFin: reservation.dateHeureFin,
        statut,
        notes: reservation.notes ?? null
      })
      .subscribe({
        next: () => this.charger(),
        error: (err) => this.erreur.set(err?.error?.message ?? 'Échec de la mise à jour.')
      });
  }

  demanderSuppression(reservation: Reservation): void {
    this.erreur.set('');
    this.aSupprimer.set(reservation);
    this.confirmOuvert.set(true);
  }

  fermerConfirm(): void {
    this.confirmOuvert.set(false);
    this.aSupprimer.set(null);
  }

  confirmerSuppression(): void {
    const cible = this.aSupprimer();
    if (!cible) {
      return;
    }

    this.reservationService.delete(cible.id).subscribe({
      next: () => {
        this.fermerConfirm();
        this.charger();
      },
      error: (err) => {
        this.fermerConfirm();
        this.erreur.set(err?.error?.message ?? 'Suppression impossible.');
      }
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
