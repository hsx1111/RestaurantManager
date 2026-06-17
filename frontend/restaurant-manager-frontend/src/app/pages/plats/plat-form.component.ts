import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categorie } from '../../models/categorie.model';
import { Plat, PlatCreate } from '../../models/plat.model';

@Component({
  selector: 'app-plat-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="overlay" (click)="annuler.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>{{ titre() }}</h3>

        <form [formGroup]="form" (ngSubmit)="valider()">
          <label for="nom">Nom</label>
          <input id="nom" type="text" formControlName="nom" />
          @if (form.controls.nom.touched && form.controls.nom.invalid) {
            <p class="erreur-champ">Le nom est requis (2 caractères minimum).</p>
          }

          <label for="description">Description</label>
          <input id="description" type="text" formControlName="description" />

          <label for="prix">Prix (€)</label>
          <input id="prix" type="number" step="0.01" formControlName="prix" />
          @if (form.controls.prix.touched && form.controls.prix.invalid) {
            <p class="erreur-champ">Le prix doit être un nombre positif.</p>
          }

          <label for="idCategorie">Catégorie</label>
          <select id="idCategorie" formControlName="idCategorie">
            <option [ngValue]="null" disabled>— Choisir —</option>
            @for (categorie of categories(); track categorie.idCategorie) {
              <option [ngValue]="categorie.idCategorie">{{ categorie.nomCategorie }}</option>
            }
          </select>
          @if (form.controls.idCategorie.touched && form.controls.idCategorie.invalid) {
            <p class="erreur-champ">La catégorie est requise.</p>
          }

          <div class="actions">
            <button type="button" class="btn-secondaire" (click)="annuler.emit()">Annuler</button>
            <button type="submit" class="btn-ok" [disabled]="form.invalid">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      h3 { margin: 0 0 1rem; }
      label { display: block; font-size: 0.85rem; color: var(--gris); margin: 0.6rem 0 0.25rem; }
      input, select {
        width: 100%;
        padding: 0.55rem 0.7rem;
        border: 1px solid var(--gris-clair);
        border-radius: 8px;
        font-size: 1rem;
      }
      input:focus, select:focus { outline: 2px solid var(--bleu); border-color: var(--bleu); }
      .erreur-champ { color: var(--rouge); font-size: 0.8rem; margin: 0.25rem 0 0; }
      .actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
      button { padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; border: 1px solid var(--gris-clair); }
      .btn-secondaire { background: var(--blanc); color: var(--noir); }
      .btn-ok { border: none; background: var(--vert); color: var(--blanc); font-weight: 600; }
      .btn-ok:disabled { background: var(--gris); cursor: default; }
    `
  ]
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
