import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../models/client.model';
import { Table } from '../../models/table.model';
import { ReservationCreate } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly clients = input<Client[]>([]);
  readonly tables = input<Table[]>([]);

  readonly enregistrer = output<ReservationCreate>();
  readonly annuler = output<void>();

  readonly form = this.fb.group({
    idClient: [null as number | null, [Validators.required]],
    idTable: [null as number | null, [Validators.required]],
    nombrePersonne: [2, [Validators.required, Validators.min(1)]],
    dateHeureDebut: ['', [Validators.required]],
    dateHeureFin: ['', [Validators.required]],
    notes: ['']
  });

  valider(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valeur = this.form.getRawValue();
    this.enregistrer.emit({
      idClient: Number(valeur.idClient),
      idTable: Number(valeur.idTable),
      nombrePersonne: Number(valeur.nombrePersonne),
      dateHeureDebut: valeur.dateHeureDebut!,
      dateHeureFin: valeur.dateHeureFin!,
      notes: valeur.notes?.trim() ? valeur.notes.trim() : null
    });
  }
}
