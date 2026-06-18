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
  templateUrl: './plats.component.html',
  styleUrl: './plats.component.css'
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
