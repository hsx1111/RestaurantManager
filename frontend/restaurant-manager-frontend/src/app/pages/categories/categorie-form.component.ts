import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categorie } from '../../models/categorie.model';

@Component({
  selector: 'app-categorie-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categorie-form.component.html',
  styleUrl: './categorie-form.component.css'
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
