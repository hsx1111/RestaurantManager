import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Table, TableCreate } from '../../models/table.model';

@Component({
  selector: 'app-tables-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tables-form.component.html',
  styleUrl: './tables-form.component.css'
})
export class TablesFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly table = input<Table | null>(null);

  readonly enregistrer = output<TableCreate>();
  readonly annuler = output<void>();

  readonly titre = computed(() => (this.table() ? 'Modifier la table' : 'Nouvelle table'));

  readonly form = this.fb.group({
    nombrePlace: [2, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    effect(() => {
      const courante = this.table();
      this.form.reset({ nombrePlace: courante ? courante.nombrePlace : 2 });
    });
  }

  valider(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enregistrer.emit({ nombrePlace: Number(this.form.getRawValue().nombrePlace) });
  }
}
