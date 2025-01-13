import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CreditCardStore } from '../../../credit-card.store';
import { Router } from '@angular/router';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardService } from '../../../../card.service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';

@Component({
  selector: 'app-billing-cycle',
  templateUrl: './billing-cycle.component.html',
  styleUrls: ['./billing-cycle.component.scss'],
})
export class BillingCycleComponent implements OnInit {
  billingCycleForm!: FormGroup;
  listOfAccounts: any = [];
  profileInfo: any;
  currencyCode: any;
  cardList: any[] | any;
  typeofCard: any;
  listOfCustomers: any[] | any;
  accountDetails: any;
  billingCycleList = CreditCardStore.billCycleList;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private cardService: CardService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
  }

  ngOnInit(): void {
    this.currencyCode = this.profileInfo?.branchCrncyCode;
    this.cardList = this.sessionStorageService.getListOfCards();
    this.listOfAccounts = this.sessionStorageService.getListOfAccounts();
    this.buildFormGroup();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  buildFormGroup() {
    this.billingCycleForm = this.formBuilder.group({
      source: ['I'],
      corporateId: [this.profileInfo?.corporateCustomerId],
      cardNo: [''],
      creditAmount: [''],
      creditCurrency: [''],
      requestDate: [''],
      billingCycleDate: [''],
    });
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.cardList?.find(
      (card: any) => card?.cardNumber == account,
    );
    if (this.accountDetails) {
      this.typeofCard = this.accountDetails?.typeOfCard;
      this.billingCycleForm
        ?.get('cardNo')
        ?.patchValue(this.accountDetails?.cardNumber);
      const dueDate = this.accountDetails?.dueDate;
      if (dueDate) {
        const dateObj = new Date(dueDate); // Parse the due date
        const day = dateObj.getDate(); // Get the day of the month
        const formattedDay = this.getOrdinalSuffix(day) + ' Each Month'; // Add ordinal suffix

        this.billingCycleForm
          ?.get('billingCycleDate')
          ?.patchValue(formattedDay);
      }
    }
  }

  getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return day + 'th'; // For 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return day + 'st';
      case 2:
        return day + 'nd';
      case 3:
        return day + 'rd';
      default:
        return day + 'th';
    }
  }

  proceed() {
    if (!this.billingCycleForm?.valid) return;
    const payload = { ...this.billingCycleForm.value };
    const paymentDetailsArr = [
      {
        eventType: 'mmidTransfer',
        operationType: 'Billing_Cycle',
        status: 'confirm',
        masterId: 'retailFundTransferMasterId',
        statusHeader: 'Comfirm Payment',
        statusNews: 'Billing Cycle Request!',
        summary: [
          {
            header: 'Card Control',
            details: [
              { 'Name on Card': this.accountDetails?.customerName },
              {
                'Card Number': this.accountDetails?.cardNumber,
              },
              {
                'Card Name': this.accountDetails?.cardName,
              },
              {
                'Credit Limit': this.accountDetails?.totalCreditLimit,
              },
              {
                'Current Billing Cycle': payload?.billingCycleDate,
              },
              {
                'Request Billing Cycle': payload?.requestDate,
              },
            ],
          },
        ],
        qrToggle: false,
      },
    ];
    this.serviceCallHandler.put(
      'serviceHandler',
      payload,
      paymentDetailsArr,
      (payload) =>
        this.cardService.saveBillingCycleCreditPaymentDetails(payload),
      // Service call completion callback
    );
    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }
}
