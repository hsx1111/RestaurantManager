import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.model';

interface LienNav {
  label: string;
  route: string;
  roles: Role[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly utilisateur = this.authService.currentUser;

  private readonly liens: LienNav[] = [
    { label: 'Plan de salle', route: '/plan-salle', roles: ['Serveur', 'Gestionnaire'] },
    { label: 'Réservations', route: '/reservations', roles: ['Serveur', 'Gestionnaire'] },
    { label: 'Cuisine', route: '/cuisine', roles: ['Cuisine', 'Gestionnaire'] },
    { label: 'Catégories', route: '/categories', roles: ['Gestionnaire'] },
    { label: 'Plats', route: '/plats', roles: ['Gestionnaire'] },
    { label: 'Tables', route: '/tables', roles: ['Gestionnaire'] },
    { label: 'Personnel', route: '/personnel', roles: ['Gestionnaire'] }
  ];

  readonly liensVisibles = computed(() => {
    const utilisateur = this.utilisateur();
    return utilisateur ? this.liens.filter((lien) => lien.roles.includes(utilisateur.role)) : [];
  });

  deconnexion(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
