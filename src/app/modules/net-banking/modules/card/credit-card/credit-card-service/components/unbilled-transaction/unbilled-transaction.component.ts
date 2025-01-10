import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CreditCardStore } from '../../../credit-card.store';
import { Router } from '@angular/router';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardService } from '../../../../card.service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'app/shared/store/models/user.model';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';

@Component({
  selector: 'app-unbilled-transaction',
  templateUrl: './unbilled-transaction.component.html',
  styleUrls: ['./unbilled-transaction.component.scss'],
})
export class UnbilledTransactionComponent implements OnInit, OnDestroy {
  unbilledForm!: FormGroup;
  currencyCode = 'INR';
  creditList: any;
  unbilledHeader = CreditCardStore.unbilledHeader;
  unbilledValues: any;
  accountDetails: any;
  typeofCard: any;
  recentTransData: any[] | any;
  profileInfo: any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private cardService: CardService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
  }

  ngOnInit(): void {
    this.creditList = this.sessionStorageService.getListOfCards();
    this.buildUnbilledForm();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  buildUnbilledForm() {
    this.unbilledForm = this.fb.group({
      creditNumber: [''],
      cardType: [''],
    });
  }

  goToConvertPage() {
    this.router.navigate(['/user/card/credit-card/service/convert-to-emi']);
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.creditList?.find(
      (card: any) => card?.cardNumber == account,
    );
    if (this.accountDetails) {
      this.typeofCard = this.accountDetails?.typeOfCard;
      this.unbilledForm
        ?.get('creditNumber')
        ?.patchValue(this.accountDetails?.cardNumber);
      this.unbilledForm
        ?.get('cardType')
        ?.patchValue(this.accountDetails?.cardType);
      this.fetchTransactions();
    }
  }

  fetchTransactions() {
    this.recentTransData = [];
    this.cardService
      .fetchCardRecentTransaction(
        this.profileInfo?.corporateCustomerId,
        this.unbilledForm?.get('creditNumber')?.value,
        this.unbilledForm?.get('cardType')?.value,
      )
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.unbilledValues = resp?.data;
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
