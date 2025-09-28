import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services';
import { AccountService } from '@features/account';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (!authService.isLogged || !accountService.isAdmin) {
    router.navigate(['/accedi']);
    return false;
  }

  return true;
};
