import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { COUNTRYCURRENCY } from 'app/shared/models/country-currency.mode';
import { HomeService } from 'app/shared/services/home-service/home.service';
import { User } from 'app/shared/store/models/user.model';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';
import { TokenStorageService } from 'app/shared/token-storage.service';
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
  routeUrl = '/account/open';
  businessSuiteName = 'ACCOUNTOPENINGSERVICES';
  category = 'Accounts';
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  currentUser: User | undefined;
  constructor(
    private homeService: HomeService,
    private router: Router,
    private el: ElementRef,
    private tokenStore: TokenStorageService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadUserProfile();
    this.getCountryCurrency();
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

  getCountryCurrency() {
    const userBranchCode = this.currentUser?.branchCode;
    this.homeService
      .getCountryCurrency(userBranchCode)
      .subscribe((resp: COUNTRYCURRENCY) => {
        if (resp?.statusCode) this.tokenStore.saveUserOtherInfo(resp.data);
      });
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
