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
  templateUrl: './commande-form.component.html',
  styleUrl: './commande-form.component.css'
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
