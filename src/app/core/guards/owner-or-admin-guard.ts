import { CanActivateFn } from '@angular/router';

//aca chequeamos si es duenio o admin
export const ownerOrAdminGuard: CanActivateFn = (route, state) => {
  return true;
};
