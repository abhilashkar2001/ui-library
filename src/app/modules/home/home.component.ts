import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SessionService } from 'app/shared/session.service';
import { UserProfileInfoAction } from 'app/shared/store/action/user-profileInfo.action';
import { User } from 'app/shared/store/models/user.model';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.onInit();
  }

  /**
   * Onint
   */
  onInit() {
    /* send username and password to get Access Token */
    const payload = {
      username: 'WEBSITE',
      password: 'Newuser@1',
    };
    const isRememberMe = true;
    const otpRequired = false;
    this.sessionService.signin(payload, isRememberMe, otpRequired).subscribe(
      () => {
        /* get profile info */
        this.store.dispatch(UserProfileInfoAction.loadUserProfile());
      },
      () => {
        this.router.navigate(['/home/401']);
      },
    );
  }
}
