import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { IconService } from 'app/shared/services/icon.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { LimitType } from '../../credit-card-usage-limit.store';
import { DrawerConstant } from 'app/shared/components/custom-drawer/custom-drawer.constant';
import { CreditcardService } from '../../creditcard.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-credit-card-internaltional-limit',
  templateUrl: './credit-card-internaltional-limit.component.html',
  styleUrls: ['./credit-card-internaltional-limit.component.scss'],
})
export class CreditCardInternaltionalLimitComponent implements OnInit {
  tabs = DrawerConstant.cardLimitTabs;

  internaltionLimitForm!: FormGroup;
  isEnable = false;
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

  fetchCardDetails() {
    const customerInfo: any = this.sessionStorageService.getCustomerInfo();
    this.creditCardService
      .getCreditCardList(customerInfo.customerId)
      .subscribe((res: any) => {
        if (res.status == 'OK') {
          this.creditCardList = res.data;
          console.log(this.creditCardList);
        }
      });
  }

  buildDomesticLimit(data?: any) {
    console.log(data);

    this.internaltionLimitForm = this.fb.group({
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
    this.internaltionLimitForm
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
    const name = 'International';
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
    this.internaltionLimitForm.get(control)?.setValue(this.ammountValue);
  }
  formatCurrencyLabel(value: any) {
    return `₹ ${value}`;
  }
  cancle() {
    this.internaltionLimitForm.reset();
  }
  getCreditCardDetailsList() {
    const list = this.sessionStorageService.getListOfCards();
    this.creditCardList = list;
  }
  next() {
    console.log(this.selecetdCardNo);

    console.log(this.internaltionLimitForm.value);
    const payload = { ...this.internaltionLimitForm.value };
    const paymentDetailsArr = [
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
                'Card Number': this.internaltionLimitForm?.get('cardNo')?.value,
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
            header: 'International Limits',
            details: [
              {
                'ATM Withdraw':
                  this.internaltionLimitForm?.get('atmRequired')?.value == true
                    ? 'Yes'
                    : 'No',
              },
              {
                'ATM Withdraw Limit':
                  this.internaltionLimitForm?.get('atmWithdraw')?.value,
              },
              {
                'Merchant Outlets':
                  this.internaltionLimitForm?.get('merchantRequired')?.value ==
                  true
                    ? 'Yes'
                    : 'No',
              },
              {
                'Merchant Outlets Limit':
                  this.internaltionLimitForm?.get('maxOnlineAmount')?.value,
              },

              {
                'Online Transaction':
                  this.internaltionLimitForm?.get('onlineRequired')?.value ==
                  true
                    ? 'Yes'
                    : 'No',
              },
              {
                'Online Transaction Limit':
                  this.internaltionLimitForm?.get('onlineTransaction')?.value,
              },
              {
                'Tap & Pay Transaction':
                  this.internaltionLimitForm?.get('tapRequired')?.value == true
                    ? 'Yes'
                    : 'No',
              },
              {
                'Tap & Pay Transaction Limit':
                  this.internaltionLimitForm?.get('tapPayTransaction')?.value,
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
      (payload) => this.creditCardService.saveDometic(payload),
    );
    this.router.navigate(['/user/card/credit-card/service/payment-summary']);
  }
  tabChanges(val: any) {
    console.log(val);
    this.selectedTabName = val?.screenName;
  }
}
