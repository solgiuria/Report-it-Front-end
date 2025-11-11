import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

//solo dejamos pasar si hay token, osea si el usuario esta logueado, sin importal su rol

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; //deja entrar
  } else {
    router.navigate(['/login']); //redirige si no hay token
    return false;
  }
};
