import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth-store';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const authStore = inject(AuthStore);
  const router = inject(Router);

  const user = authStore.user();

  if (user?.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {

      if (error.status === 401) {
        authStore.logout();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};