import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HomeService } from 'app/shared/services/home-service/home.service';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit, OnDestroy {
  data: [] = [];
  imageUrl = 'assets/images/account-landing-image.svg';
  profileHeader = 'Savings Made Simple: Open Your Account in 3 Easy Steps.';
  profileHint =
    'Supercharge your savings for a wealthier you. Say hello to financial freedom! Join now and watch your money flourish.';
  category = 'Accounts';
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  currentUser: User | undefined;
  constructor(
    private homeService: HomeService,
    private router: Router,
    private el: ElementRef,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadUserProfile();
    this.getAccountTypes();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currentUser = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  getAccountTypes() {
    this.homeService
      .getAccountTypes(this.category)
      .subscribe((response: any) => {
        if (response) this.data = response.data;
      });
  }
  customApplyLoan(event: Event) {
    this.router.navigate(['account/applyAccount', event]);
  }
  customApply() {
    const targetElement =
      this.el.nativeElement.querySelector('#custom-carousel');
    const targetPosition = targetElement.getBoundingClientRect().top;
    if (targetElement) {
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
