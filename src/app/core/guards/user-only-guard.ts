import { CanActivateFn } from '@angular/router';

//aca vemos si roles.includes("USER")
export const userOnlyGuard: CanActivateFn = (route, state) => {
  return true;
};
