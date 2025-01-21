import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthServiceService);  // Inyectar el servicio de autenticación
  const router = inject(Router);  // Inyectar el Router

  // Si el usuario está autenticado, permitimos el acceso
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, redirigimos al login
  router.navigate(['/login']);
  return false;
  
};
