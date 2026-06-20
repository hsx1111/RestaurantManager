import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../models/auth.model';
import { Utilisateur, UtilisateurCreate } from '../../models/utilisateur.model';

@Component({
  selector: 'app-personnel-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personnel-form.component.html',
  styleUrl: './personnel-form.component.css'
})
export class PersonnelFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly utilisateur = input<Utilisateur | null>(null);

  readonly enregistrer = output<UtilisateurCreate>();
  readonly annuler = output<void>();

  readonly modeEdition = computed(() => this.utilisateur() !== null);
  readonly titre = computed(() => (this.modeEdition() ? 'Modifier le membre' : 'Nouveau membre'));

  readonly roles: Role[] = ['Serveur', 'Gestionnaire', 'Cuisine'];

  readonly form = this.fb.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    pin: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
    role: ['Serveur' as Role, [Validators.required]]
  });

  constructor() {
    effect(() => {
      const courant = this.utilisateur();
      if (courant) {
        this.form.reset({ nom: courant.nom, prenom: courant.prenom, pin: '', role: courant.role });
        this.form.controls.pin.setValidators([Validators.pattern(/^[0-9]{4}$/)]);
      } else {
        this.form.reset({ nom: '', prenom: '', pin: '', role: 'Serveur' });
        this.form.controls.pin.setValidators([Validators.required, Validators.pattern(/^[0-9]{4}$/)]);
      }
      this.form.controls.pin.updateValueAndValidity();
    });
  }

  valider(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valeur = this.form.getRawValue();
    this.enregistrer.emit({
      nom: valeur.nom!.trim(),
      prenom: valeur.prenom!.trim(),
      pin: valeur.pin ?? '',
      role: valeur.role as Role
    });
  }
}
