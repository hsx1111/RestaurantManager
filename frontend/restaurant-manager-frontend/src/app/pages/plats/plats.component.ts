import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatService } from '../../services/plat.service';
import { CategorieService } from '../../services/categorie.service';
import { Plat, PlatCreate } from '../../models/plat.model';
import { Categorie } from '../../models/categorie.model';
import { PlatFormComponent } from './plat-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

@Component({
  selector: 'app-plats',
  standalone: true,
  imports: [PlatFormComponent, ConfirmDialogComponent],
  template: `
    <section class="page">
      <div class="entete">
        <h1>Plats</h1>
        <button type="button" class="ajouter" (click)="ajouter()">+ Ajouter un plat</button>
      </div>

      <div class="filtres">
        <input
          type="search"
          placeholder="Rechercher un plat…"
          [value]="recherche()"
          (input)="recherche.set($any($event.target).value)"
        />
        <select [value]="filtreCategorie() ?? ''" (change)="majFiltre($any($event.target).value)">
          <option value="">Toutes les catégories</option>
          @for (categorie of categories(); track categorie.idCategorie) {
            <option [value]="categorie.idCategorie">{{ categorie.nomCategorie }}</option>
          }
        </select>
      </div>

      @if (erreur()) {
        <p class="banniere-erreur">{{ erreur() }}</p>
      }

      <table class="tableau">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Description</th>
            <th class="col-prix">Prix</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (plat of platsFiltres(); track plat.id) {
            <tr>
              <td>{{ plat.nom }}</td>
              <td>{{ plat.nomCategorie }}</td>
              <td class="desc">{{ plat.description || '—' }}</td>
              <td class="col-prix">{{ plat.prix.toFixed(2) }} €</td>
              <td class="col-actions">
                <button type="button" class="icone" title="Modifier" (click)="editer(plat)">✏️</button>
                <button type="button" class="icone" title="Supprimer" (click)="demanderSuppression(plat)">🗑️</button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="vide">Aucun plat.</td>
            </tr>
          }
        </tbody>
      </table>
    </section>

    @if (formOuvert()) {
      <app-plat-form
        [plat]="platEnEdition()"
        [categories]="categories()"
        (enregistrer)="enregistrer($event)"
        (annuler)="fermerForm()"
      />
    }

    @if (confirmOuvert()) {
      <app-confirm-dialog
        titre="Supprimer le plat"
        [message]="'Supprimer « ' + (platASupprimer()?.nom ?? '') + ' » ?'"
        libelleConfirmer="Supprimer"
        couleur="rouge"
        (confirmer)="confirmerSuppression()"
        (annuler)="fermerConfirm()"
      />
    }
  `,
  styles: [
    `
      .entete { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
      h1 { margin: 0; font-size: 1.4rem; }
      .ajouter { background: var(--vert); color: var(--blanc); border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
      .filtres { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
      .filtres input { flex: 1; }
      .filtres input, .filtres select { padding: 0.5rem 0.7rem; border: 1px solid var(--gris-clair); border-radius: 8px; font-size: 0.95rem; }
      .banniere-erreur { background: #fdecef; color: var(--rouge); border: 1px solid var(--rouge); padding: 0.6rem 0.9rem; border-radius: 8px; font-weight: 600; }
      .tableau { width: 100%; border-collapse: collapse; background: var(--blanc); border: 1px solid var(--gris-clair); border-radius: 10px; overflow: hidden; }
      th, td { text-align: left; padding: 0.75rem 1rem; border-bottom: 1px solid var(--gris-clair); }
      thead th { background: var(--gris-tres-clair); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.03em; color: var(--gris); }
      tbody tr:last-child td { border-bottom: none; }
      .desc { color: var(--gris-fonce); }
      .col-prix { text-align: right; white-space: nowrap; }
      .col-actions { width: 110px; text-align: right; }
      .icone { background: transparent; border: none; cursor: pointer; font-size: 1.1rem; padding: 0.2rem 0.4rem; }
      .vide { text-align: center; color: var(--gris); }
    `
  ]
})
export class PlatsComponent implements OnInit {
  private readonly platService = inject(PlatService);
  private readonly categorieService = inject(CategorieService);

  readonly plats = signal<Plat[]>([]);
  readonly categories = signal<Categorie[]>([]);
  readonly recherche = signal('');
  readonly filtreCategorie = signal<number | null>(null);
  readonly erreur = signal('');

  readonly formOuvert = signal(false);
  readonly platEnEdition = signal<Plat | null>(null);

  readonly confirmOuvert = signal(false);
  readonly platASupprimer = signal<Plat | null>(null);

  readonly platsFiltres = computed(() => {
    const terme = this.recherche().trim().toLowerCase();
    const categorie = this.filtreCategorie();
    return this.plats().filter((plat) => {
      const correspondNom = plat.nom.toLowerCase().includes(terme);
      const correspondCategorie = categorie === null || plat.idCategorie === categorie;
      return correspondNom && correspondCategorie;
    });
  });

  ngOnInit(): void {
    this.chargerPlats();
    this.categorieService.getAll().subscribe({
      next: (liste) => this.categories.set(liste),
      error: () => this.erreur.set('Impossible de charger les catégories.')
    });
  }

  private chargerPlats(): void {
    this.platService.getAll().subscribe({
      next: (liste) => this.plats.set(liste),
      error: () => this.erreur.set('Impossible de charger les plats.')
    });
  }

  majFiltre(valeur: string): void {
    this.filtreCategorie.set(valeur ? Number(valeur) : null);
  }

  ajouter(): void {
    this.erreur.set('');
    this.platEnEdition.set(null);
    this.formOuvert.set(true);
  }

  editer(plat: Plat): void {
    this.erreur.set('');
    this.platEnEdition.set(plat);
    this.formOuvert.set(true);
  }

  fermerForm(): void {
    this.formOuvert.set(false);
    this.platEnEdition.set(null);
  }

  enregistrer(payload: PlatCreate): void {
    const enEdition = this.platEnEdition();
    const requete: Observable<unknown> = enEdition
      ? this.platService.update(enEdition.id, payload)
      : this.platService.create(payload);

    requete.subscribe({
      next: () => {
        this.fermerForm();
        this.chargerPlats();
      },
      error: (err) => this.erreur.set(err?.error?.message ?? "Échec de l'enregistrement du plat.")
    });
  }

  demanderSuppression(plat: Plat): void {
    this.erreur.set('');
    this.platASupprimer.set(plat);
    this.confirmOuvert.set(true);
  }

  fermerConfirm(): void {
    this.confirmOuvert.set(false);
    this.platASupprimer.set(null);
  }

  confirmerSuppression(): void {
    const cible = this.platASupprimer();
    if (!cible) {
      return;
    }

    this.platService.delete(cible.id).subscribe({
      next: () => {
        this.fermerConfirm();
        this.chargerPlats();
      },
      error: (err) => {
        this.fermerConfirm();
        this.erreur.set(err?.error?.message ?? 'Suppression impossible.');
      }
    });
  }
}
