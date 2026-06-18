import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TableService } from '../../services/table.service';
import { ToastService } from '../../services/toast.service';
import { Table } from '../../models/table.model';

@Component({
  selector: 'app-plan-salle',
  standalone: true,
  templateUrl: './plan-salle.component.html',
  styleUrl: './plan-salle.component.css'
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
