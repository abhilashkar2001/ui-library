import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorageService } from '@onerumango/utils';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const AuthGuard = (): Observable<boolean> => {
  const router = inject(Router);
  const tokenStorageService = inject(TokenStorageService);
  return tokenStorageService.isLoggedIn().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/home']);
        return false;
      }
      return true;
    }),
  );
};
