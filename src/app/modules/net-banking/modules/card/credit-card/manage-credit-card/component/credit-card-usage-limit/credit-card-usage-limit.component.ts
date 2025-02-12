import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceCallHandler } from 'app/shared/services/service-call.handler';
import { IconService } from 'app/shared/services/icon.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { LimitType } from '../../credit-card-usage-limit.store';
import { CreditcardService } from '../../creditcard.service';
import { debounceTime } from 'rxjs/operators';
import { DrawerConstant } from '../../../../../shared-corporate-banking/custom-drawer/custom-drawer.constant';

@Component({
  selector: 'app-credit-card-usage-limit',
  templateUrl: './credit-card-usage-limit.component.html',
  styleUrls: ['./credit-card-usage-limit.component.scss'],
})
export class CreditCardUsageLimitComponent implements OnInit {
  tabs = DrawerConstant.cardLimitTabs;

  limitForm!: FormGroup;
  menuLabels: { [key: number]: string } = {};
  selectedCurrency: any;
  max = 140000;
  min = 5000;
  ammountValue = 0;
  currencySymbol = '₹';
  thumbLabel: boolean | any = true;
  limitType: any = LimitType.Limits;
  creditCardList: any;
  selecetdCardNo: any;
  selectedTabName: any;
  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private iconService: IconService,
    private creditCardService: CreditcardService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
  ) {
    this.iconService
      .addIconIfNotExists('info-icon', 'assets/images/svg/info_yellow.svg')
      .subscribe();
  }

  ngOnInit(): void {
    this.buildDomesticLimit();
    this.getCreditCardDetailsList();
    this.selectedTabName == 'Domestic limits';
  }

  buildDomesticLimit(data?: any) {
    this.limitForm = this.fb.group({
      usageType: ['Domestic'],
      cardNo: [data ? data?.cardNo : ''],
      enable: [data ? data?.enable : false],
      atmWithdraw: [data ? data?.atmWithdrawal : ''],
      atmRequired: [data ? data?.atmRequired : false],
      minAtmAmount: [data ? data?.minAtmAmount : null],
      maxAtmAmount: [data ? data?.maxAtmAmount : null],
      onlineTransaction: [data ? data?.onlineTransaction : ''],
      onlineRequired: [data ? data?.onlineRequired : false],
      minOnlineAmount: [data ? data?.minOnlineAmount : null],
      maxOnlineAmount: [data ? data?.maxOnlineAmount : null],
      merchantOutlets: [data ? data?.merchantOutLet : ''],
      merchantRequired: [data ? data?.merchantRequired : false],
      minMerchantAmount: [data ? data?.minMerchantAmount : null],
      maxMerchantAmount: [data ? data?.maxMerchantAmount : null],
      tapPayTransaction: [data ? data?.tapPayTransaction : ''],
      tapRequired: [data ? data?.tapRequired : false],
      minTapRequired: [data ? data?.minTapRequired : null],
      maxTapRequired: [data ? data?.maxTapRequired : null],
    });
    this.limitForm
      .get('cardNo')
      ?.valueChanges.pipe(debounceTime(200))
      .subscribe((val) => {
        console.log(val);
        if (val) {
          this.selecetdCardNo = this.creditCardList.filter(
            (item: any) => item?.cardNumber == val,
          );
          console.log(this.selecetdCardNo);
        }
      });
  }
  payAccount(event: any) {
    console.log(event);
    const name = 'Domestic';
    this.creditCardService
      .fetchAccountDetails(event, name)
      .subscribe((response: any) => {
        console.log(response);
        this.buildDomesticLimit(response?.data);
      });
  }
  toggleMenu(index: number, event: boolean) {
    this.menuLabels[index] = event ? 'Enable' : 'Disable';
  }
  getMenuLabel(index: number): string {
    return this.menuLabels[index] || 'Disable'; // Default to 'Disable'
  }

  onSliderChange(e: any, control: any) {
    this.ammountValue = e?.value;
    this.limitForm.get(control)?.setValue(this.ammountValue);
  }
  formatCurrencyLabel(value: any) {
    return `₹ ${value}`;
  }
  cancle() {
    this.limitForm.reset();
  }
  getCreditCardDetailsList() {
    const list = this.sessionStorageService.getListOfCards();
    this.creditCardList = list;
  }
  next() {
    console.log(this.selecetdCardNo);

    console.log(this.limitForm.value);
    const payload = { ...this.limitForm.value };
    const creditPaymentArr = [
      {
        eventType: 'mmidTransfer',
        operationType: 'Schedule_Payment',
        status: 'confirm',
        masterId: 'retailFundTransferMasterId',
        statusHeader: 'Confirm Details',
        summary: [
          {
            header: 'Card Detail',
            details: [
              { 'Card Detail': this.selecetdCardNo[0]?.customerName },
              {
                'Card Number': this.limitForm?.get('cardNo')?.value,
              },
              {
                'Card Name': this.selecetdCardNo[0]?.cardName,
              },
              {
                'credit limit': this.selecetdCardNo[0]?.totalCreditLimit,
              },
            ],
          },
          {
            header: 'Domestic Limits',
            details: [
              {
                'ATM Withdraw':
                  this.limitForm?.get('atmRequired')?.value == true
                    ? 'Yes'
                    : 'No',
              },
              {
                'ATM Withdraw Limit': this.limitForm?.get('atmWithdraw')?.value,
              },
              {
                'Merchant Outlets':
                  this.limitForm?.get('merchantRequired')?.value == true
                    ? 'Yes'
                    : 'No',
              },
              {
                'Merchant Outlets Limit':
                  this.limitForm?.get('maxOnlineAmount')?.value,
              },

              {
                'Online Transaction':
                  this.limitForm?.get('onlineRequired')?.value == true
                    ? 'Yes'
                    : 'No',
              },
              {
                'Online Transaction Limit':
                  this.limitForm?.get('onlineTransaction')?.value,
              },
              {
                'Tap & Pay Transaction':
                  this.limitForm?.get('tapRequired')?.value == true
                    ? 'Yes'
                    : 'No',
              },
              {
                'Tap & Pay Transaction Limit':
                  this.limitForm?.get('tapPayTransaction')?.value,
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
      creditPaymentArr,
      (payload) => this.creditCardService.saveDometic(payload),
    );
    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }
  tabChanges(val: any) {
    console.log(val);
    this.selectedTabName = val?.screenName;
  }
}
