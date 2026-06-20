import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './layouts/app-layout.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { PlatsComponent } from './pages/plats/plats.component';
import { PersonnelComponent } from './pages/personnel/personnel.component';
import { TablesComponent } from './pages/tables/tables.component';
import { PlanSalleComponent } from './pages/plan-salle/plan-salle.component';
import { CommandeFormComponent } from './pages/commande/commande-form.component';
import { TableDetailComponent } from './pages/table-detail/table-detail.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
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
      { path: 'personnel', component: PersonnelComponent, canActivate: [roleGuard('Gestionnaire')] },
      { path: 'tables', component: TablesComponent, canActivate: [roleGuard('Gestionnaire')] },
      { path: 'plan-salle', component: PlanSalleComponent, canActivate: [roleGuard('Serveur', 'Gestionnaire')] },
      { path: 'commande/nouvelle/:idTable', component: CommandeFormComponent, canActivate: [roleGuard('Serveur', 'Gestionnaire')] },
      { path: 'table/:idTable', component: TableDetailComponent, canActivate: [roleGuard('Serveur', 'Gestionnaire')] },
      { path: 'reservations', component: ReservationsComponent, canActivate: [roleGuard('Serveur', 'Gestionnaire')] },
      { path: 'cuisine', component: CuisineComponent, canActivate: [roleGuard('Cuisine', 'Gestionnaire')] }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
