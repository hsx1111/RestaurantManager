import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categorie } from '../../models/categorie.model';

@Component({
  selector: 'app-categorie-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="overlay" (click)="annuler.emit()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>{{ titre() }}</h3>
        <label for="nom">Nom de la catégorie</label>
        <input
          id="nom"
          type="text"
          [ngModel]="nom()"
          (ngModelChange)="nom.set($event)"
          (keyup.enter)="valider()"
        />
        <div class="actions">
          <button type="button" class="btn-secondaire" (click)="annuler.emit()">Annuler</button>
          <button type="button" class="btn-ok" [disabled]="!nom().trim()" (click)="valider()">Enregistrer</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      h3 {
        margin: 0 0 1rem;
      }
      label {
        display: block;
        font-size: 0.85rem;
        color: var(--gris);
        margin-bottom: 0.35rem;
      }
      input {
        width: 100%;
        padding: 0.6rem 0.7rem;
        border: 1px solid var(--gris-clair);
        border-radius: 8px;
        font-size: 1rem;
        margin-bottom: 1.5rem;
      }
      input:focus {
        outline: 2px solid var(--bleu);
        border-color: var(--bleu);
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
      button {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        border: 1px solid var(--gris-clair);
      }
      .btn-secondaire {
        background: var(--blanc);
        color: var(--noir);
      }
      .btn-ok {
        border: none;
        background: var(--vert);
        color: var(--blanc);
        font-weight: 600;
      }
      .btn-ok:disabled {
        background: var(--gris);
        cursor: default;
      }
    `
  ]
})
export class CategorieFormComponent {
  readonly categorie = input<Categorie | null>(null);

  readonly enregistrer = output<string>();
  readonly annuler = output<void>();

  readonly nom = signal('');
  readonly titre = computed(() => (this.categorie() ? 'Modifier la catégorie' : 'Nouvelle catégorie'));

  constructor() {
    effect(() => {
      const courante = this.categorie();
      this.nom.set(courante ? courante.nomCategorie : '');
    });
  }

  valider(): void {
    const valeur = this.nom().trim();
    if (valeur) {
      this.enregistrer.emit(valeur);
    }
  }
}
