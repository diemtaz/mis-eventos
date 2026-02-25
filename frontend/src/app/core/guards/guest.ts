import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth-store';

export const guestGuard: CanActivateFn = () => {

  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.user();

  if (user?.token) {
    return router.createUrlTree(['/events']);
  }

  return true;
};