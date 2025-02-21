import { Routes } from '@angular/router';
import { CheqsCascadeMainComponent } from './components/cheqs-cascade-main/cheqs-cascade-main.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { BusinessManagementComponent } from './components/business-management/business-management.component';

export const routes: Routes = [
  {path: "", component: CheqsCascadeMainComponent, canActivate: [authGuard]},
  {path: "my-businesses", component: BusinessManagementComponent, canActivate: [authGuard]},
  {path: "login", component: LoginComponent}, // ruta del login
  // otras rutas
];
