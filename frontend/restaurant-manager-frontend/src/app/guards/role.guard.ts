import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/auth.model';

export function roleGuard(...rolesAutorises: Role[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const utilisateur = authService.currentUser();

    if (utilisateur && rolesAutorises.includes(utilisateur.role)) {
      return true;
    }

    return router.createUrlTree(['/login']);
  };
}
