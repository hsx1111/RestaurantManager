import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginResponse, Role } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly pin = signal('');
  readonly erreur = signal('');
  readonly chargement = signal(false);

  readonly positions = [0, 1, 2, 3];
  readonly touches = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  private readonly routesParRole: Record<Role, string> = {
    Serveur: '/plan-salle',
    Gestionnaire: '/categories',
    Cuisine: '/cuisine'
  };

  ajouter(chiffre: string): void {
    if (this.chargement() || this.pin().length >= 4) {
      return;
    }
    this.erreur.set('');
    this.pin.update((valeur) => valeur + chiffre);

    if (this.pin().length === 4) {
      this.valider();
    }
  }

  effacer(): void {
    if (this.chargement()) {
      return;
    }
    this.erreur.set('');
    this.pin.update((valeur) => valeur.slice(0, -1));
  }

  private valider(): void {
    this.chargement.set(true);
    this.authService.login(this.pin()).subscribe({
      next: (utilisateur) => this.rediriger(utilisateur),
      error: () => {
        this.erreur.set('Code PIN invalide');
        this.pin.set('');
        this.chargement.set(false);
      }
    });
  }

  private rediriger(utilisateur: LoginResponse): void {
    this.router.navigate([this.routesParRole[utilisateur.role] ?? '/login']);
  }
}
