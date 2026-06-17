import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './layouts/app-layout.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { PlatsComponent } from './pages/plats/plats.component';
import { PlanSalleComponent } from './pages/plan-salle/plan-salle.component';
import { CuisineComponent } from './pages/cuisine/cuisine.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'categories', component: CategoriesComponent, canActivate: [roleGuard('Gestionnaire')] },
      { path: 'plats', component: PlatsComponent, canActivate: [roleGuard('Gestionnaire')] },
      { path: 'plan-salle', component: PlanSalleComponent },
      { path: 'cuisine', component: CuisineComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
