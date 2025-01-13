import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { CreditCardService } from "../../../credit-card.service";
import { Router } from '@angular/router';
import { CreditCardStore } from '../../../credit-card.store';
import { CardService } from '../../../../card.service';
import { AccountList } from 'app/shared/models/card.model';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '@onerumango/utils';
import { Store } from '@ngrx/store';
import { selectUser } from '@onerumango/utils';

@Component({
  selector: 'app-add-on-card',
  templateUrl: './add-on-card.component.html',
  styleUrls: ['./add-on-card.component.scss'],
})
export class AddOnCardComponent implements OnInit, OnDestroy {
  addonCardForm!: FormGroup;
  cardList: AccountList[] | any;
  typeofCard: string | any;
  currencyCode: string | any;
  accountDetails: AccountList | any;
  profileInfo: any;
  items = CreditCardStore.relationShipDetail;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private sessionStorageService: SessionStorageService,
    private cardService: CardService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
  }

  ngOnInit(): void {
    this.currencyCode = this.profileInfo?.branchCrncyCode;
    this.cardList = this.sessionStorageService.getListOfCards();
    this.buildAddonCardForm();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }
  buildAddonCardForm() {
    this.addonCardForm = this.fb.group({
      cardNumber: [''],
      accountNo: [''],
      nameRequired: [''],
      relationShip: [''],
      dateOfBirth: [''],
    });
  }
  payFromCurrencyCode(value: any) {
    this.addonCardForm?.get('debitCurrency')?.setValue(value);
  }

  patchDetails(event: any) {
    const account = event;
    this.accountDetails = this.cardList?.find(
      (card: any) => card?.cardNumber == account,
    );
    if (this.accountDetails) {
      this.typeofCard = this.accountDetails?.typeOfCard;
      this.addonCardForm
        ?.get('cardNumber')
        ?.patchValue(this.accountDetails?.cardNumber);
    }
  }

  proceed() {
    if (!this.addonCardForm?.valid) return;
    const payload = { ...this.addonCardForm.value };
    const paymentDetailsArr = [
      {
        eventType: 'mmidTransfer',
        operationType: 'Autopay',
        status: 'confirm',
        masterId: 'retailFundTransferMasterId',
        statusHeader: 'Comfirm Payment',
        statusNews: 'Add-on Card Request!',
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
            ],
          },
          {
            header: 'Card Control',
            details: [
              { 'Name Required': payload?.nameRequired },
              {
                'Date Of Birth': payload?.dateOfBirth,
              },
              {
                Relationship: payload?.relationShip,
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
      (payload) => this.cardService.saveAddOnCreditPaymentDetails(payload),
      // Service call completion callback
    );
    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
