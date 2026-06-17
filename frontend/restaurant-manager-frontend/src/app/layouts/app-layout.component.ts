import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="barre">
      <span class="logo">🍽️ Restaurant Manager</span>
      <div class="droite">
        @if (utilisateur(); as u) {
          <span class="user">
            {{ u.prenom }} {{ u.nom }}
            <span class="role">{{ u.role }}</span>
          </span>
        }
        <button type="button" class="deconnexion" (click)="deconnexion()">Déconnexion</button>
      </div>
    </header>

    <main class="contenu">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .barre {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.5rem;
        height: 56px;
        background: var(--noir);
        color: var(--blanc);
      }
      .logo {
        font-weight: 700;
      }
      .droite {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .user {
        font-size: 0.9rem;
      }
      .role {
        display: inline-block;
        margin-left: 0.35rem;
        padding: 0.1rem 0.5rem;
        border-radius: 999px;
        background: var(--bleu);
        font-size: 0.75rem;
      }
      .deconnexion {
        background: transparent;
        border: 1px solid var(--gris);
        color: var(--blanc);
        padding: 0.4rem 0.8rem;
        border-radius: 8px;
        cursor: pointer;
      }
      .deconnexion:hover {
        background: var(--gris-fonce);
      }
      .contenu {
        max-width: 960px;
        margin: 0 auto;
        padding: 1.5rem;
      }
    `
  ]
})
export class AppLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly utilisateur = this.authService.currentUser;

  deconnexion(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
