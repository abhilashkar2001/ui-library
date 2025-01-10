import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CardService } from '../../../../card.service';
import { Observable, Subscription } from 'rxjs';
import { User } from 'app/shared/store/models/user.model';
import { Store } from '@ngrx/store';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';

@Component({
  selector: 'app-e-statement',
  templateUrl: './e-statement.component.html',
  styleUrls: ['./e-statement.component.scss'],
})
export class EStatementComponent implements OnInit, OnDestroy {
  customerInfo: any;
  screenName: string | any;
  eStatementForm!: FormGroup;
  accountNumberList: any[] = [];
  selectedAccInfo: any;
  genericValue: any = { DOCUMENTTYPE: [], SCHEDULEPAYMENT: [] };
  profileInfo: any;
  accountDetails: any;
  typeofCard: any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private sessionStorageService: SessionStorageService,
    private genericValueService: GenericValueService,
    private cardService: CardService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
  }

  ngOnInit(): void {
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.accountNumberList = this.sessionStorageService.getListOfCards();
    this.fetchGenericValues();
    this.bulidForm();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue('Common', Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k]),
          );
        }
      });
  }

  bulidForm() {
    this.eStatementForm = this.fb.group({
      cardNo: ['', [Validators.required]],
      cardName: [''],
      accountType: [''],
      email: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      format: ['', [Validators.required]],
    });
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.accountNumberList?.find(
      (card) => card?.cardNumber == account,
    );
    if (this.accountDetails) {
      this.typeofCard = this.accountDetails?.typeOfCard;
      this.eStatementForm
        ?.get('cardNo')
        ?.patchValue(this.accountDetails?.cardNumber);
      this.eStatementForm
        ?.get('cardName')
        ?.patchValue(this.accountDetails?.cardName);
      this.eStatementForm
        ?.get('accountType')
        ?.patchValue(this.accountDetails?.cardType);
      this.eStatementForm?.get('email')?.patchValue(this.accountDetails?.email);
    }
  }

  handleAccountNumberChange(accountNo: any) {
    console.log(accountNo);
    this.selectedAccInfo = this.accountNumberList.find(
      (item) => item?.accountNo == accountNo,
    );
    this.eStatementForm
      .get('accountType')
      ?.patchValue(this.selectedAccInfo?.cardType);
    this.eStatementForm.get('email')?.patchValue(this.profileInfo?.emailId);
  }

  proceed() {
    const payload: any = {
      ...this.eStatementForm.value,
      name: this.customerInfo?.customerName,
    };

    const summaryDetails = [
      {
        eventType: 'mmidTransfer',
        operationType: 'E Statement',
        status: 'confirm',
        statusHeader: 'Comfirm Subscription',
        statusNews: 'E Statement Subscribed Successfully',
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
                Email: payload?.email,
              },
              {
                Frequency: payload?.frequency,
              },
              {
                Format: payload?.format,
              },
            ],
          },
        ],
      },
    ];

    this.serviceCallHandler.put(
      'serviceHandler',
      payload,
      summaryDetails,
      (payload) => this.cardService.eStatementSubscribe(payload),
    );

    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }
  close() {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
