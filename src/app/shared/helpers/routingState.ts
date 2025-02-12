import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TokenStorageService, UserProfileAction } from '@onerumango/utils';

@Injectable({
  providedIn: 'root',
})
export class RoutingState {
  history: string[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private tokenService: TokenStorageService,
  ) {}

  loadRouting(): void {
    if (this.tokenService.getToken() && !this.router.navigated)
      this.store.dispatch(UserProfileAction.loadUserProfile());
    else this.router.navigate(['/home']);
  }

  getHistory() {
    return this.history;
  }
}
