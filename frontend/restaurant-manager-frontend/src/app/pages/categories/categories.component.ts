import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CategorieService } from '../../services/categorie.service';
import { Categorie } from '../../models/categorie.model';
import { CategorieFormComponent } from './categorie-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CategorieFormComponent, ConfirmDialogComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  private readonly categorieService = inject(CategorieService);

  readonly categories = signal<Categorie[]>([]);
  readonly erreur = signal('');

  readonly formOuvert = signal(false);
  readonly categorieEnEdition = signal<Categorie | null>(null);

  readonly confirmOuvert = signal(false);
  readonly categorieASupprimer = signal<Categorie | null>(null);

  ngOnInit(): void {
    this.charger();
  }

  private charger(): void {
    this.categorieService.getAll().subscribe({
      next: (liste) => this.categories.set(liste),
      error: () => this.erreur.set('Impossible de charger les catégories.')
    });
  }

  ajouter(): void {
    this.erreur.set('');
    this.categorieEnEdition.set(null);
    this.formOuvert.set(true);
  }

  editer(categorie: Categorie): void {
    this.erreur.set('');
    this.categorieEnEdition.set(categorie);
    this.formOuvert.set(true);
  }

  fermerForm(): void {
    this.formOuvert.set(false);
    this.categorieEnEdition.set(null);
  }

  enregistrer(nom: string): void {
    const enEdition = this.categorieEnEdition();
    const requete: Observable<unknown> = enEdition
      ? this.categorieService.update(enEdition.idCategorie, nom)
      : this.categorieService.create(nom);

    requete.subscribe({
      next: () => {
        this.fermerForm();
        this.charger();
      },
      error: () => this.erreur.set("Échec de l'enregistrement de la catégorie.")
    });
  }

  demanderSuppression(categorie: Categorie): void {
    this.erreur.set('');
    this.categorieASupprimer.set(categorie);
    this.confirmOuvert.set(true);
  }

  fermerConfirm(): void {
    this.confirmOuvert.set(false);
    this.categorieASupprimer.set(null);
  }

  confirmerSuppression(): void {
    const cible = this.categorieASupprimer();
    if (!cible) {
      return;
    }

    this.categorieService.delete(cible.idCategorie).subscribe({
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
