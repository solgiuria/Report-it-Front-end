import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

//aca vemos si roles.includes("USER"), igual que en admin guard
export const userOnlyGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUser()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
