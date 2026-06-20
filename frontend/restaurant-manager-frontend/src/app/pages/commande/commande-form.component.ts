import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { ToastService } from '../../services/toast.service';
import { LignePanier } from '../../models/commande.model';
import { MenuPanierComponent } from '../../components/menu-panier.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

@Component({
  selector: 'app-commande-form',
  standalone: true,
  imports: [MenuPanierComponent, ConfirmDialogComponent],
  templateUrl: './commande-form.component.html',
  styleUrl: './commande-form.component.css'
})
export class CommandeFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly commandeService = inject(CommandeService);
  private readonly toast = inject(ToastService);

  readonly idTable = Number(this.route.snapshot.paramMap.get('idTable'));

  readonly erreur = signal('');
  readonly confirmOuvert = signal(false);
  readonly lignesEnAttente = signal<LignePanier[]>([]);

  readonly total = computed(() =>
    this.lignesEnAttente().reduce((somme, ligne) => somme + ligne.plat.prix * ligne.quantite, 0)
  );

  readonly nbArticles = computed(() =>
    this.lignesEnAttente().reduce((somme, ligne) => somme + ligne.quantite, 0)
  );

  onValider(lignes: LignePanier[]): void {
    this.lignesEnAttente.set(lignes);
    this.confirmOuvert.set(true);
  }

  confirmer(): void {
    this.confirmOuvert.set(false);
    this.commandeService
      .create({
        idClient: null,
        idTable: this.idTable,
        lignes: this.lignesEnAttente().map((ligne) => ({ idPlat: ligne.plat.id, quantite: ligne.quantite }))
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
