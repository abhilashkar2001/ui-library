import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { CardService } from '../../../../card.service';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { AccountList } from 'app/shared/models/card.model';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';

@Component({
  selector: 'app-prepaid-reload',
  templateUrl: './prepaid-reload.component.html',
  styleUrls: ['./prepaid-reload.component.scss'],
})
export class PrepaidReloadComponent implements OnInit, OnDestroy {
  reloadForm!: FormGroup;
  prepaidRegister: any[] = [
    { label: 'Prepaid Register', value: true },
    { label: 'Prepaid Non - Register', value: false },
  ];
  setUpPayment: any[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  staticData = {
    SCHEDULEPAYMENT: [],
  };
  genericValue: any;
  cardList: AccountList[] | any;
  profileInfo: User | undefined;
  customerInfo: any;
  accountDetails: AccountList | any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
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
    this.buildReloadForm();
    this.fetchGenericValue();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  buildReloadForm() {
    this.reloadForm = this.fb.group({
      prepaidRegister: [true],
      payFrom: [''],
      cardNumber: [''],
      confirmCardNo: [''],
      cvv: [''],
      nickName: [''],
      setUpPayment: [''],
      currencyCode: [''],
      paymentAmount: [''],
      schedulePayment: [''],
      frequency: [''],
      noOfInstallments: [''],
      remarks: [''],
    });
  }

  //fetch generic value
  fetchGenericValue() {
    this.genericValueService
      .loadGenericValue('Common', Object.keys(this.staticData))
      .subscribe((res: any) => {
        this.genericValue = res?.data;
      });
  }

  selectedCard(event: Event) {
    if (event) {
      this.accountDetails = this.cardList.find(
        (card: any) => card.cardNumber == event,
      );
      this.reloadForm
        .get('currencyCode')
        ?.setValue(this.accountDetails?.currencyCode);
    }
  }

  proceed() {
    const payload: any = {
      ...this.reloadForm.value,
      corporateId: this.profileInfo?.corporateCustomerId,
    };
    payload.cvv = Number(payload.cvv);
    payload.noOfInstallments = Number(payload.noOfInstallments);
    payload.schedulePayment = moment(payload.schedulePayment).format(
      'DD-MMM-YYYY',
    );
    delete payload.confirmCardNo;
    const creditPaymentArr = [
      {
        eventType: 'mmidTransfer',
        status: 'confirm',
        statusHeader: 'Comfirm Details',
        masterId: 'benificiaryMasterId',
        statusNews: 'Reload Successfully!',
        summary: [
          {
            header: 'Card Controls',
            details: [
              {
                'Name on card': this.customerInfo?.customerName,
              },
              {
                'Card Number': this.reloadForm?.get('payFrom')?.value,
              },
              {
                'Card Name': this.accountDetails?.cardName,
              },
            ],
          },
          {
            header: 'Payment Details',
            details: [
              { Name: this.customerInfo?.customerName },
              {
                'Account No': this.reloadForm.get('payFrom')?.value,
              },
              {
                'Payment Amount': this.customerInfo?.accounts[0]?.accountType,
              },
              {
                'Schedule Payment':
                  this.reloadForm.get('schedulePayment')?.value,
              },
              {
                Frequency: this.reloadForm.get('frequency')?.value,
              },
              {
                'No of installments':
                  this.reloadForm.get('noOfInstallments')?.value,
              },
              {
                Remarks: this.reloadForm.get('remarks')?.value,
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
      (payload) => this.cardService.savePrepaidReload(payload),
    );
    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
