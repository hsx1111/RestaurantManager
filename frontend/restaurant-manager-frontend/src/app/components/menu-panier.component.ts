import { Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { CategorieService } from '../services/categorie.service';
import { PlatService } from '../services/plat.service';
import { Categorie } from '../models/categorie.model';
import { Plat } from '../models/plat.model';
import { LignePanier } from '../models/commande.model';

@Component({
  selector: 'app-menu-panier',
  standalone: true,
  templateUrl: './menu-panier.component.html',
  styleUrl: './menu-panier.component.css'
})
export class MenuPanierComponent implements OnInit {
  private readonly categorieService = inject(CategorieService);
  private readonly platService = inject(PlatService);

  readonly libelleValider = input('Valider');
  readonly valider = output<LignePanier[]>();

  readonly categories = signal<Categorie[]>([]);
  readonly plats = signal<Plat[]>([]);
  readonly categorieSelection = signal<number | null>(null);
  readonly panier = signal<LignePanier[]>([]);

  readonly platsAffiches = computed(() =>
    this.plats().filter((plat) => plat.idCategorie === this.categorieSelection())
  );

  readonly total = computed(() =>
    this.panier().reduce((somme, ligne) => somme + ligne.plat.prix * ligne.quantite, 0)
  );

  ngOnInit(): void {
    this.categorieService.getAll().subscribe({
      next: (liste) => {
        this.categories.set(liste);
        if (liste.length > 0) {
          this.categorieSelection.set(liste[0].idCategorie);
        }
      }
    });

    this.platService.getAll().subscribe({
      next: (liste) => this.plats.set(liste)
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

  emettre(): void {
    if (this.panier().length > 0) {
      this.valider.emit(this.panier());
    }
  }

  reset(): void {
    this.panier.set([]);
  }
}
