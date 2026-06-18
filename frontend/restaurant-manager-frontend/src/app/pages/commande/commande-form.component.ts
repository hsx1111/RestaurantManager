import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorieService } from '../../services/categorie.service';
import { PlatService } from '../../services/plat.service';
import { CommandeService } from '../../services/commande.service';
import { ToastService } from '../../services/toast.service';
import { Categorie } from '../../models/categorie.model';
import { Plat } from '../../models/plat.model';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

interface LignePanier {
  plat: Plat;
  quantite: number;
}

@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [ConfirmDialogComponent],
  template: `
    <section class="commande">
      <div class="entete">
        <h1>Commande — Table {{ idTable }}</h1>
        <button type="button" class="retour" (click)="annuler()">← Retour au plan</button>
      </div>

      @if (erreur()) {
        <p class="banniere-erreur">{{ erreur() }}</p>
      }

      <div class="zone">
        <div class="menu">
          <div class="cats">
            @for (categorie of categories(); track categorie.idCategorie) {
              <button
                type="button"
                class="cat"
                [class.actif]="categorie.idCategorie === categorieSelection()"
                (click)="categorieSelection.set(categorie.idCategorie)"
              >
                {{ categorie.nomCategorie }}
              </button>
            }
          </div>

          <div class="plats">
            @for (plat of platsAffiches(); track plat.id) {
              <button type="button" class="plat" (click)="ajouter(plat)">
                <span>{{ plat.nom }}</span>
                <span class="prix">{{ plat.prix.toFixed(2) }} €</span>
              </button>
            } @empty {
              <p class="vide">Aucun plat dans cette catégorie.</p>
            }
          </div>
        </div>

        <aside class="panier">
          <h2>Panier</h2>
          @if (panier().length === 0) {
            <p class="vide">Panier vide. Choisissez des plats.</p>
          } @else {
            <ul class="lignes">
              @for (ligne of panier(); track ligne.plat.id) {
                <li>
                  <span class="nom">{{ ligne.plat.nom }}</span>
                  <span class="qte">
                    <button type="button" (click)="retirer(ligne.plat)">−</button>
                    <span>{{ ligne.quantite }}</span>
                    <button type="button" (click)="ajouter(ligne.plat)">+</button>
                  </span>
                  <span class="sous-total">{{ (ligne.plat.prix * ligne.quantite).toFixed(2) }} €</span>
                </li>
              }
            </ul>
            <div class="total">
              <span>Total</span>
              <span>{{ total().toFixed(2) }} €</span>
            </div>
            <button type="button" class="valider" (click)="confirmOuvert.set(true)">Valider la commande</button>
          }
        </aside>
      </div>
    </section>

    @if (confirmOuvert()) {
      <app-confirm-dialog
        titre="Valider la commande"
        [message]="'Confirmer ' + nbArticles() + ' article(s) pour ' + total().toFixed(2) + ' € ?'"
        libelleConfirmer="Valider"
        couleur="vert"
        (confirmer)="valider()"
        (annuler)="confirmOuvert.set(false)"
      />
    }
  `,
  styles: [
    `
      .entete { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
      h1 { margin: 0; font-size: 1.3rem; }
      .retour { background: transparent; border: none; color: var(--bleu); cursor: pointer; font-size: 0.9rem; }
      .banniere-erreur { background: #fdecef; color: var(--rouge); border: 1px solid var(--rouge); padding: 0.6rem 0.9rem; border-radius: 8px; font-weight: 600; }
      .zone { display: grid; grid-template-columns: 1fr 320px; gap: 1.25rem; align-items: start; }
      .menu { background: var(--blanc); border: 1px solid var(--gris-clair); border-radius: 12px; padding: 1rem; }
      .cats { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
      .cat { padding: 0.4rem 0.9rem; border-radius: 999px; border: 1px solid var(--gris-clair); background: var(--gris-tres-clair); cursor: pointer; font-size: 0.9rem; }
      .cat.actif { background: var(--noir); color: var(--blanc); border-color: var(--noir); }
      .plats { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.6rem; }
      .plat { display: flex; flex-direction: column; gap: 0.3rem; align-items: flex-start; padding: 0.7rem; border: 1px solid var(--gris-clair); border-radius: 10px; background: var(--gris-tres-clair); cursor: pointer; text-align: left; }
      .plat:hover { background: var(--gris-clair); }
      .plat .prix { color: var(--gris-fonce); font-size: 0.85rem; }
      .panier { background: var(--blanc); border: 1px solid var(--gris-clair); border-radius: 12px; padding: 1rem; position: sticky; top: 1rem; }
      .panier h2 { margin: 0 0 0.75rem; font-size: 1.05rem; }
      .lignes { list-style: none; margin: 0 0 0.75rem; padding: 0; }
      .lignes li { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 0.5rem; padding: 0.4rem 0; border-bottom: 1px solid var(--gris-clair); }
      .nom { font-size: 0.9rem; }
      .qte { display: flex; align-items: center; gap: 0.4rem; }
      .qte button { width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--gris-clair); background: var(--gris-tres-clair); cursor: pointer; }
      .sous-total { font-size: 0.85rem; white-space: nowrap; min-width: 60px; text-align: right; }
      .total { display: flex; justify-content: space-between; font-weight: 700; margin: 0.5rem 0 1rem; }
      .valider { width: 100%; padding: 0.6rem; border: none; border-radius: 8px; background: var(--vert); color: var(--blanc); font-weight: 600; cursor: pointer; }
      .vide { color: var(--gris); font-size: 0.9rem; }
    `
  ]
})
export class CommandeFormComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categorieService = inject(CategorieService);
  private readonly platService = inject(PlatService);
  private readonly commandeService = inject(CommandeService);
  private readonly toast = inject(ToastService);

  readonly idTable = Number(this.route.snapshot.paramMap.get('idTable'));

  readonly categories = signal<Categorie[]>([]);
  readonly plats = signal<Plat[]>([]);
  readonly categorieSelection = signal<number | null>(null);
  readonly panier = signal<LignePanier[]>([]);
  readonly confirmOuvert = signal(false);
  readonly erreur = signal('');

  readonly platsAffiches = computed(() =>
    this.plats().filter((plat) => plat.idCategorie === this.categorieSelection())
  );

  readonly total = computed(() =>
    this.panier().reduce((somme, ligne) => somme + ligne.plat.prix * ligne.quantite, 0)
  );

  readonly nbArticles = computed(() =>
    this.panier().reduce((somme, ligne) => somme + ligne.quantite, 0)
  );

  ngOnInit(): void {
    this.categorieService.getAll().subscribe({
      next: (liste) => {
        this.categories.set(liste);
        if (liste.length > 0) {
          this.categorieSelection.set(liste[0].idCategorie);
        }
      },
      error: () => this.erreur.set('Impossible de charger les catégories.')
    });

    this.platService.getAll().subscribe({
      next: (liste) => this.plats.set(liste),
      error: () => this.erreur.set('Impossible de charger les plats.')
    });
  }

  ajouter(plat: Plat): void {
    this.panier.update((lignes) => {
      const existante = lignes.find((l) => l.plat.id === plat.id);
      if (existante) {
        return lignes.map((l) => (l.plat.id === plat.id ? { ...l, quantite: l.quantite + 1 } : l));
      }
      return [...lignes, { plat, quantite: 1 }];
    });
  }

  retirer(plat: Plat): void {
    this.panier.update((lignes) =>
      lignes
        .map((l) => (l.plat.id === plat.id ? { ...l, quantite: l.quantite - 1 } : l))
        .filter((l) => l.quantite > 0)
    );
  }

  valider(): void {
    this.confirmOuvert.set(false);
    this.commandeService
      .create({
        idClient: null,
        idTable: this.idTable,
        lignes: this.panier().map((ligne) => ({ idPlat: ligne.plat.id, quantite: ligne.quantite }))
      })
      .subscribe({
        next: () => {
          this.toast.show(`Commande enregistrée pour la table ${this.idTable}`);
          this.router.navigate(['/plan-salle']);
        },
        error: () => this.erreur.set("Échec de l'enregistrement de la commande.")
      });
  }

  annuler(): void {
    this.router.navigate(['/plan-salle']);
  }
}
