import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilisateurService } from '../../services/utilisateur.service';
import { Utilisateur, UtilisateurCreate } from '../../models/utilisateur.model';
import { PersonnelFormComponent } from './personnel-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog.component';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [PersonnelFormComponent, ConfirmDialogComponent],
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.css'
})
export class PersonnelComponent implements OnInit {
  private readonly utilisateurService = inject(UtilisateurService);

  readonly utilisateurs = signal<Utilisateur[]>([]);
  readonly erreur = signal('');

  readonly formOuvert = signal(false);
  readonly enEdition = signal<Utilisateur | null>(null);

  readonly confirmOuvert = signal(false);
  readonly aSupprimer = signal<Utilisateur | null>(null);

  ngOnInit(): void {
    this.charger();
  }

  private charger(): void {
    this.utilisateurService.getAll().subscribe({
      next: (liste) => this.utilisateurs.set(liste),
      error: () => this.erreur.set('Impossible de charger le personnel.')
    });
  }

  ajouter(): void {
    this.erreur.set('');
    this.enEdition.set(null);
    this.formOuvert.set(true);
  }

  editer(utilisateur: Utilisateur): void {
    this.erreur.set('');
    this.enEdition.set(utilisateur);
    this.formOuvert.set(true);
  }

  fermerForm(): void {
    this.formOuvert.set(false);
    this.enEdition.set(null);
  }

  enregistrer(donnees: UtilisateurCreate): void {
    const enEdition = this.enEdition();
    const requete: Observable<unknown> = enEdition
      ? this.utilisateurService.update(enEdition.id, {
          nom: donnees.nom,
          prenom: donnees.prenom,
          role: donnees.role,
          pin: donnees.pin || undefined
        })
      : this.utilisateurService.create(donnees);

    requete.subscribe({
      next: () => {
        this.fermerForm();
        this.charger();
      },
      error: (err) => this.erreur.set(err?.error?.message ?? "Échec de l'enregistrement du membre.")
    });
  }

  demanderSuppression(utilisateur: Utilisateur): void {
    this.erreur.set('');
    this.aSupprimer.set(utilisateur);
    this.confirmOuvert.set(true);
  }

  fermerConfirm(): void {
    this.confirmOuvert.set(false);
    this.aSupprimer.set(null);
  }

  confirmerSuppression(): void {
    const cible = this.aSupprimer();
    if (!cible) {
      return;
    }

    this.utilisateurService.delete(cible.id).subscribe({
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
