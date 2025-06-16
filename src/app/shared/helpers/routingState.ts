import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TokenStorageService, UserProfileAction } from '@onerumango/utils';
import { BeforeUnloadService } from '../services/before-unload.service';
import { filter } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoutingState {
  history: string[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private tokenService: TokenStorageService,
    private beforeUnloadService: BeforeUnloadService,
  ) {}

  loadRouting(): void {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        if (
          urlAfterRedirects
            .toLowerCase()
            .includes('origination/loan/create-loan')
        ) {
          this.beforeUnloadService.enable();
        } else {
          this.beforeUnloadService.disable();
        }
        this.history = [...this.history, urlAfterRedirects];
      });

    // IF ENV IS PROD WILL TAKE EFFECT
    if (!this.router.navigated) {
      if (environment.production) {
        this.router.navigate(['/home']);
      } else {
        if (this.tokenService.getToken()) {
          this.store.dispatch(UserProfileAction.loadUserProfile());
        }
      }
    }
  }

  getHistory() {
    return this.history;
  }
}
