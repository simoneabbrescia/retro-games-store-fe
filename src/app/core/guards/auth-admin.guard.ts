import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@core/services';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  return authService.isAdmin();
};
