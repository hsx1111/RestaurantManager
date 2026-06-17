import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './layouts/app-layout.component';
import { PlanSalleComponent } from './pages/plan-salle/plan-salle.component';
import { CuisineComponent } from './pages/cuisine/cuisine.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'plan-salle', component: PlanSalleComponent },
      { path: 'cuisine', component: CuisineComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
