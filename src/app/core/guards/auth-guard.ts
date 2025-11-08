import { CanActivateFn } from '@angular/router';

//aca chequeamos token
export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
