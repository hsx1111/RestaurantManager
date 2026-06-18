import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TableService } from '../../services/table.service';
import { ToastService } from '../../services/toast.service';
import { Table } from '../../models/table.model';

@Component({
  selector: 'app-plan-salle',
  standalone: true,
  template: `
    <section class="page">
      <h1>Plan de salle</h1>

      @if (toast.message()) {
        <div class="toast">{{ toast.message() }}</div>
      }
      @if (info()) {
        <div class="info">{{ info() }}</div>
      }

      <div class="grille">
        @for (table of tables(); track table.id) {
          <button
            type="button"
            class="carte"
            [class.libre]="table.estLibre"
            [class.occupee]="!table.estLibre"
            (click)="ouvrir(table)"
          >
            <span class="numero">Table {{ table.id }}</span>
            <span class="capacite">{{ table.nombrePlace }} places</span>
            <span class="statut">{{ table.estLibre ? 'Libre' : 'Occupée' }}</span>
          </button>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .page h1 { margin-top: 0; }
      .toast {
        background: var(--vert);
        color: var(--blanc);
        padding: 0.7rem 1rem;
        border-radius: 8px;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      .info {
        background: #fff6e6;
        color: var(--orange);
        border: 1px solid var(--orange);
        padding: 0.6rem 0.9rem;
        border-radius: 8px;
        margin-bottom: 1rem;
      }
      .grille {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
      .carte {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.35rem;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid var(--gris-clair);
        background: var(--blanc);
        cursor: pointer;
        text-align: left;
        border-left: 6px solid var(--gris);
      }
      .carte:hover { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08); }
      .carte.libre { border-left-color: var(--vert); }
      .carte.occupee { border-left-color: var(--rouge); }
      .numero { font-weight: 700; font-size: 1.05rem; }
      .capacite { color: var(--gris); font-size: 0.85rem; }
      .statut {
        margin-top: 0.25rem;
        font-size: 0.8rem;
        font-weight: 600;
      }
      .carte.libre .statut { color: var(--vert); }
      .carte.occupee .statut { color: var(--rouge); }
    `
  ]
})
export class PlanSalleComponent implements OnInit {
  private readonly tableService = inject(TableService);
  private readonly router = inject(Router);
  readonly toast = inject(ToastService);

  readonly tables = signal<Table[]>([]);
  readonly info = signal('');

  ngOnInit(): void {
    this.tableService.getAll().subscribe({
      next: (liste) => this.tables.set(liste),
      error: () => this.info.set('Impossible de charger les tables.')
    });
  }

  ouvrir(table: Table): void {
    if (table.estLibre) {
      this.router.navigate(['/commande/nouvelle', table.id]);
    } else {
      this.info.set('Clôture non implémentée dans cette version');
    }
  }
}
