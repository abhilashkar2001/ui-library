import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SessionService } from 'app/shared/services/session.service';
import { UserProfileAction } from '@onerumango/utils';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';
import { Observable, Subscription } from 'rxjs';

/**
 * Component responsible for handling the home view and user authentication.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /**
   * Observable stream of the current user profile.
   */
  userProfile$: Observable<User | null>;

  /**
   * Array of subscriptions to be cleaned up on component destruction.
   */
  subscriptions: Subscription[] = [];

  /**
   * Creates an instance of HomeComponent.
   *
   * @param {SessionService} sessionService - Service to handle session-related operations.
   * @param {Router} router - Angular Router for navigation.
   * @param {Store} store - NgRx Store to manage application state.
   */
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  /**
   * Angular lifecycle hook that is called after the component's data-bound properties are initialized.
   * Calls the onInit method to handle user sign-in.
   */
  ngOnInit(): void {
    this.onInit();
  }

  /**
   * Initializes the component by attempting to sign in a predefined user.
   * On successful sign-in, it dispatches an action to load the user profile and navigates to the account page.
   * On failure, it navigates to an unauthorized access page.
   */
  onInit(): void {
    const payload = {
      username: 'WEBSITE',
      password: 'Newuser@1',
    };
    const isRememberMe = true;
    const otpRequired = false;
    this.sessionService.signin(payload, isRememberMe, otpRequired).subscribe(
      () => {
        this.store.dispatch(UserProfileAction.loadUserProfile());
        this.router.navigate(['/origination/loan']);
      },
      () => {
        this.router.navigate(['/home/401']);
      },
    );
  }
}
