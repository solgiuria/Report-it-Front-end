import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

//aca chequeamos si roles.includes("ADMIN"), si el JWT incluye ese rol
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true; // si tiene rol admin → puede entrar
  } else {
    router.navigate(['/login']); // si no, lo mandamos al login
    return false;
  }
};
