import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TableService } from '../../services/table.service';
import { Table, TableCreate } from '../../models/table.model';
import { TablesFormComponent } from './tables-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [TablesFormComponent, ConfirmDialogComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent implements OnInit {
  private readonly tableService = inject(TableService);

  readonly tables = signal<Table[]>([]);
  readonly erreur = signal('');

  readonly formOuvert = signal(false);
  readonly enEdition = signal<Table | null>(null);

  readonly confirmOuvert = signal(false);
  readonly aSupprimer = signal<Table | null>(null);

  ngOnInit(): void {
    this.charger();
  }

  private charger(): void {
    this.tableService.getAll().subscribe({
      next: (liste) => this.tables.set(liste),
      error: () => this.erreur.set('Impossible de charger les tables.')
    });
  }

  ajouter(): void {
    this.erreur.set('');
    this.enEdition.set(null);
    this.formOuvert.set(true);
  }

  editer(table: Table): void {
    this.erreur.set('');
    this.enEdition.set(table);
    this.formOuvert.set(true);
  }

  fermerForm(): void {
    this.formOuvert.set(false);
    this.enEdition.set(null);
  }

  enregistrer(donnees: TableCreate): void {
    const enEdition = this.enEdition();
    const requete: Observable<unknown> = enEdition
      ? this.tableService.update(enEdition.id, donnees)
      : this.tableService.create(donnees);

    requete.subscribe({
      next: () => {
        this.fermerForm();
        this.charger();
      },
      error: (err) => this.erreur.set(err?.error?.message ?? "Échec de l'enregistrement de la table.")
    });
  }

  demanderSuppression(table: Table): void {
    this.erreur.set('');
    this.aSupprimer.set(table);
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

    this.tableService.delete(cible.id).subscribe({
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
}
