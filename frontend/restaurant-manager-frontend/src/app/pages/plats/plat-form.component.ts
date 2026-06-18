import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categorie } from '../../models/categorie.model';
import { Plat, PlatCreate } from '../../models/plat.model';

@Component({
  selector: 'app-plat-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './plat-form.component.html',
  styleUrl: './plat-form.component.css'
})
export class PlatFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly plat = input<Plat | null>(null);
  readonly categories = input<Categorie[]>([]);

  readonly enregistrer = output<PlatCreate>();
  readonly annuler = output<void>();

  readonly titre = computed(() => (this.plat() ? 'Modifier le plat' : 'Nouveau plat'));

  readonly form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    prix: [0, [Validators.required, Validators.min(0)]],
    idCategorie: [null as number | null, [Validators.required]]
  });

  constructor() {
    effect(() => {
      const courant = this.plat();
      if (courant) {
        this.form.setValue({
          nom: courant.nom,
          description: courant.description ?? '',
          prix: courant.prix,
          idCategorie: courant.idCategorie
        });
      } else {
        this.form.reset({ nom: '', description: '', prix: 0, idCategorie: null });
      }
    });
  }

  valider(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valeur = this.form.getRawValue();
    this.enregistrer.emit({
      nom: valeur.nom!.trim(),
      description: valeur.description?.trim() ? valeur.description.trim() : null,
      prix: Number(valeur.prix),
      idCategorie: Number(valeur.idCategorie)
    });
  }
}
