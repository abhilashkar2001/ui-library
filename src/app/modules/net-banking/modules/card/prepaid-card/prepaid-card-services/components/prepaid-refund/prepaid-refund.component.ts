import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrepaidRefundStore } from './prepaid-refund.store';
import { Router } from '@angular/router';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardService } from '../../../../card.service';
import { AccountList } from 'app/shared/models/card.model';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'app/shared/store/models/user.model';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';

@Component({
  selector: 'app-prepaid-refund',
  templateUrl: './prepaid-refund.component.html',
  styleUrls: ['./prepaid-refund.component.scss'],
})
export class PrepaidRefundComponent implements OnInit, OnDestroy {
  refundForm!: FormGroup;
  viewColumnData = PrepaidRefundStore.columnHeaders;
  cardList: AccountList[] | any;
  profileInfo!: User;
  customerInfo: any;
  cardDetails: any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private sessionStorageService: SessionStorageService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
  }

  ngOnInit(): void {
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.cardList = this.sessionStorageService.getListOfCards();
    this.buildRefundForm();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  buildRefundForm() {
    this.refundForm = this.fb.group({
      transferTo: [''],
      fromPrepaidCard: [''],
      fullRefund: [''],
      currencyCode: [''],
      currencyUnit: [''],
      balanceAmount: [''],
    });
  }

  fetchCardDetails(event: any) {
    this.cardService
      .fetchRefund(event)
      .subscribe((res: IcHttpResponseModel<any>) => {
        if (res?.statusCode == 200 && res?.data?.length) {
          this.cardDetails = [res?.data[0]];
          this.refundForm.get('fullRefund')?.setValue(res?.data[0]?.fullRefund);
          this.refundForm
            .get('currencyCode')
            ?.setValue(res?.data[0]?.currencyCode);
          this.refundForm
            .get('currencyUnit')
            ?.setValue(res?.data[0]?.currencyUnit);
          this.refundForm
            .get('balanceAmount')
            ?.setValue(res?.data[0]?.balanceAmount);
        }
      });
  }

  proceed() {
    const selectedCardNumber = this.refundForm?.get('fromPrepaidCard')?.value;
    const accountDetails = this.cardList.find(
      (card: any) => card.cardNumber == selectedCardNumber,
    );
    const payload: any = {
      ...this.refundForm.value,
    };
    const creditPaymentArr = [
      {
        eventType: 'mmidTransfer',
        status: 'confirm',
        statusHeader: 'Comfirm Details',
        masterId: 'benificiaryMasterId',
        statusNews: 'Refund Successfully!',
        summary: [
          {
            header: 'Credit Account',
            details: [
              {
                'Payee Name': this.customerInfo?.customerName,
              },
              {
                'Account Type': this.customerInfo?.accounts[0]?.accountType,
              },
              {
                'Account No': this.refundForm.get('transferTo')?.value,
              },
            ],
          },
          {
            header: 'Credit Account',
            details: [
              {
                'Card Holder': accountDetails?.customerName,
              },
              {
                'Card Number': this.refundForm?.get('fromPrepaidCard')?.value,
              },
              {
                'Card Type': accountDetails?.cardName,
              },
            ],
          },
          {
            header: 'Currency',
            details: [
              { Currency: this.refundForm.get('currencyCode')?.value },
              {
                'Currency Unit': this.refundForm.get('currencyUnit')?.value,
              },
              {
                'Balance Amount': this.refundForm.get('balanceAmount')?.value,
              },
            ],
          },
        ],
      },
    ];
    this.serviceCallHandler.put(
      'serviceHandler',
      payload,
      creditPaymentArr,
      (payload) => this.cardService.savePrepaidRefund(payload),
    );
    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
