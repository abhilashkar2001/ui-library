import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '@onerumango/utils';

@Injectable()
export class AuthGuard {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
  ) {}

  canActivate() {
    if (this.tokenService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/home/401']);
      return false;
    }
  }
}
