import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginResponse, Role } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login">
      <div class="card">
        <h1>Restaurant Manager</h1>
        <p class="sous-titre">Entrez votre code PIN</p>

        <div class="ronds">
          @for (i of positions; track i) {
            <span class="rond" [class.rempli]="i < pin().length"></span>
          }
        </div>

        @if (erreur()) {
          <p class="erreur">{{ erreur() }}</p>
        }

        <div class="pave">
          @for (touche of touches; track touche) {
            <button type="button" class="touche" [disabled]="chargement()" (click)="ajouter(touche)">
              {{ touche }}
            </button>
          }
          <span class="vide"></span>
          <button type="button" class="touche" [disabled]="chargement()" (click)="ajouter('0')">0</button>
          <button type="button" class="touche effacer" [disabled]="chargement()" (click)="effacer()">⌫</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem;
      }
      .card {
        width: 320px;
        background: var(--blanc);
        border: 1px solid var(--gris-clair);
        border-radius: 16px;
        padding: 2rem 1.5rem;
        text-align: center;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
      }
      h1 {
        margin: 0 0 0.25rem;
        font-size: 1.3rem;
      }
      .sous-titre {
        margin: 0 0 1.5rem;
        color: var(--gris);
        font-size: 0.9rem;
      }
      .ronds {
        display: flex;
        justify-content: center;
        gap: 0.9rem;
        margin-bottom: 1rem;
      }
      .rond {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid var(--gris);
        transition: background 0.15s, border-color 0.15s;
      }
      .rond.rempli {
        background: var(--noir);
        border-color: var(--noir);
      }
      .erreur {
        color: var(--rouge);
        font-weight: 600;
        font-size: 0.9rem;
        margin: 0 0 1rem;
      }
      .pave {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
      .touche {
        aspect-ratio: 1;
        font-size: 1.4rem;
        border: 1px solid var(--gris-clair);
        background: var(--gris-tres-clair);
        border-radius: 12px;
        cursor: pointer;
        color: var(--noir);
        transition: background 0.1s;
      }
      .touche:hover:not(:disabled) {
        background: var(--gris-clair);
      }
      .touche:active:not(:disabled) {
        background: var(--gris);
        color: var(--blanc);
      }
      .touche:disabled {
        opacity: 0.5;
        cursor: default;
      }
      .effacer {
        font-size: 1.2rem;
      }
      .vide {
        visibility: hidden;
      }
    `
  ]
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
