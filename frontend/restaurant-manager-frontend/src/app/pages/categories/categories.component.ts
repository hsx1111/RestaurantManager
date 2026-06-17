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
  template: `
    <section class="page">
      <div class="entete">
        <h1>Catégories</h1>
        <button type="button" class="ajouter" (click)="ajouter()">+ Ajouter</button>
      </div>

      @if (erreur()) {
        <p class="banniere-erreur">{{ erreur() }}</p>
      }

      <table class="tableau">
        <thead>
          <tr>
            <th>Nom</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (categorie of categories(); track categorie.idCategorie) {
            <tr>
              <td>{{ categorie.nomCategorie }}</td>
              <td class="col-actions">
                <button type="button" class="icone" title="Modifier" (click)="editer(categorie)">✏️</button>
                <button type="button" class="icone" title="Supprimer" (click)="demanderSuppression(categorie)">🗑️</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="2" class="vide">Aucune catégorie.</td>
            </tr>
          }
        </tbody>
      </table>
    </section>

    @if (formOuvert()) {
      <app-categorie-form
        [categorie]="categorieEnEdition()"
        (enregistrer)="enregistrer($event)"
        (annuler)="fermerForm()"
      />
    }

    @if (confirmOuvert()) {
      <app-confirm-dialog
        titre="Supprimer la catégorie"
        [message]="'Supprimer « ' + (categorieASupprimer()?.nomCategorie ?? '') + ' » ?'"
        libelleConfirmer="Supprimer"
        couleur="rouge"
        (confirmer)="confirmerSuppression()"
        (annuler)="fermerConfirm()"
      />
    }
  `,
  styles: [
    `
      .entete {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      h1 {
        margin: 0;
        font-size: 1.4rem;
      }
      .ajouter {
        background: var(--vert);
        color: var(--blanc);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }
      .banniere-erreur {
        background: #fdecef;
        color: var(--rouge);
        border: 1px solid var(--rouge);
        padding: 0.6rem 0.9rem;
        border-radius: 8px;
        font-weight: 600;
      }
      .tableau {
        width: 100%;
        border-collapse: collapse;
        background: var(--blanc);
        border: 1px solid var(--gris-clair);
        border-radius: 10px;
        overflow: hidden;
      }
      th,
      td {
        text-align: left;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--gris-clair);
      }
      thead th {
        background: var(--gris-tres-clair);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--gris);
      }
      tbody tr:last-child td {
        border-bottom: none;
      }
      .col-actions {
        width: 120px;
        text-align: right;
      }
      .icone {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0.2rem 0.4rem;
      }
      .vide {
        text-align: center;
        color: var(--gris);
      }
    `
  ]
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
