import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeService } from '../../services/commande.service';
import { ToastService } from '../../services/toast.service';
import { CommandeDetail, LignePanier } from '../../models/commande.model';
import { MenuPanierComponent } from '../../components/menu-panier.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

@Component({
  selector: 'app-table-detail',
  standalone: true,
  imports: [MenuPanierComponent, ConfirmDialogComponent],
  templateUrl: './table-detail.component.html',
  styleUrl: './table-detail.component.css'
})
export class TableDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly commandeService = inject(CommandeService);
  private readonly toast = inject(ToastService);

  private readonly menu = viewChild(MenuPanierComponent);

  readonly idTable = Number(this.route.snapshot.paramMap.get('idTable'));
  readonly commande = signal<CommandeDetail | null>(null);
  readonly erreur = signal('');
  readonly modePaiement = signal('Especes');
  readonly confirmOuvert = signal(false);

  readonly modes = ['Especes', 'Carte', 'Cheque', 'Virement'];

  readonly estEnCours = computed(() => this.commande()?.statut === 'EnCours');
  readonly estServie = computed(() => this.commande()?.statut === 'Servie');
  readonly libelleStatut = computed(() => {
    switch (this.commande()?.statut) {
      case 'EnCours':
        return 'En préparation';
      case 'Servie':
        return 'Prête à encaisser';
      default:
        return '';
    }
  });

  ngOnInit(): void {
    this.charger();
  }

  private charger(): void {
    this.commandeService.getParTable(this.idTable).subscribe({
      next: (commande) => this.commande.set(commande),
      error: () => this.erreur.set('Aucune commande active sur cette table.')
    });
  }

  onAjouter(lignes: LignePanier[]): void {
    const commande = this.commande();
    if (!commande) {
      return;
    }
    this.commandeService
      .ajouterLignes(commande.id, lignes.map((ligne) => ({ idPlat: ligne.plat.id, quantite: ligne.quantite })))
      .subscribe({
        next: (maj) => {
          this.commande.set(maj);
          this.menu()?.reset();
        },
        error: (err) => this.erreur.set(err?.error?.message ?? "Échec de l'ajout des plats.")
      });
  }

  cloturer(): void {
    const commande = this.commande();
    if (!commande) {
      return;
    }
    this.confirmOuvert.set(false);
    this.commandeService.cloturer(commande.id, this.modePaiement()).subscribe({
      next: (facture) => {
        this.toast.show(`Table ${this.idTable} encaissée : ${facture.montantTotal.toFixed(2)} € (${facture.modePaiement}).`);
        this.router.navigate(['/plan-salle']);
      },
      error: (err) => this.erreur.set(err?.error?.message ?? 'Échec de la clôture.')
    });
  }

  annuler(): void {
    this.router.navigate(['/plan-salle']);
  }
}
