import { CanActivateFn } from '@angular/router';

//aca chequeamos si roles.includes("ADMIN")
export const adminGuard: CanActivateFn = (route, state) => {
  return true;
};
