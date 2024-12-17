import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { TokenStorageService } from '../token-storage.service';
import { NotificationService } from '../services/notification.service';
import { RequestCache } from '../services/request-cache.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class UserActiveState {
  userLoginValidInSecs: any;
  userActivity: any;
  userInactive: Subject<any> = new Subject();
  userLoginValid: any;

  // Watch for events on the window (or any other element).
  keyboardInput$ = fromEvent(window, 'mousemove').pipe(tap());
  // Hold a reference to the subscription.
  keyboardSub?: Subscription | any;
  elapsedTime: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loginTime!: number;
  intervalId!: number | NodeJS.Timeout;
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private chache: RequestCache,
  ) {
    // Subscribe to the property or use the async pipe.
    // Remember to unsubscribe when you are done if you don't use the async pipe (see other example).
    this.keyboardSub = this.keyboardInput$.subscribe(() => {
      clearTimeout(this.userActivity);
      this.setTimeout();
    });
  }

  startTimer() {
    this.loginTime = Date.now(); // Record login time in milliseconds

    // Update elapsed time every second
    this.intervalId = setInterval(() => {
      this.updateElapsedTime();
    }, 1000);
  }

  updateElapsedTime() {
    const currentTime = Date.now();
    this.elapsedTime.next(
      this.userLoginValidInSecs -
        Math.floor((currentTime - this.loginTime) / 1000),
    );
  }

  getUserActivity() {
    this.userLoginValidInSecs = this.tokenStorageService.getValidityInSecs();
    this.startTimer();
    if (this.userLoginValidInSecs) {
      this.userLoginValid = setTimeout(() => {
        this.logout();
      }, this.userLoginValidInSecs * 1000);
    }
  }

  setTimeout() {
    this.userActivity = setTimeout(() => {
      if (this.tokenStorageService.isLoggedIn()) {
        this.userInactive.next(true);
        console.log('logged out');
      }
    }, 900000);
  }

  logout() {
    this.notificationService.showError('Ok !', 'Your Session Expired');

    setTimeout(() => {
      this.dialog.closeAll();
      this.tokenStorageService.cleanUpSessionPartially();
      this.chache.clear();
      this.router.navigate(['/home'], {
        queryParams: { type: 'auth' },
      });
    }, 3500);
  }

  unsubscribeAll() {
    this.keyboardSub.unsubscribe();
    clearTimeout(this.userActivity);
    clearTimeout(this.userLoginValid);
    clearInterval(this.intervalId);
    this.elapsedTime.next(0);
  }
}
