import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChequeService } from 'app/modules/net-banking/modules/dashboard/modules/cheque-book/cheque-service';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { SchedulePaymentService } from 'app/shared/services/fund-transfer/schedule-payment.service';
import { SendMoneyService } from 'app/shared/services/fund-transfer/send-money.service';
import { TransferMoneyService } from 'app/shared/services/fund-transfer/transfer-money.service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { User } from 'app/shared/store/models/user.model';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-transfer-money',
  templateUrl: './transfer-money.component.html',
  styleUrls: ['./transfer-money.component.scss'],
})
export class TransferMoneyComponent implements OnInit, OnDestroy {
  transferMoneyForm!: FormGroup;
  proceedTransferMoney = false;
  transferType: any[] = [];
  recurringOptions: any[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  transferOptions: any[] = [
    { label: 'Now', value: 'now' },
    { label: 'Later', value: 'later' },
  ];
  customerInfo: any;
  profileInfo: any;
  selectedTransferAccount: any;
  filterFav: any[] = [];
  payeeDetails: any;
  accountNo: any;
  staticData = {
    SCHEDULEPAYMENT: [],
    PAYMENTMODE: [],
  };
  genericValue: any;
  accountType: any;
  bankName: any;
  selectedCurrency: any;
  fetchingDetails: any;
  currencyCode: string | any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private transferMoneyService: TransferMoneyService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
    private genericValueService: GenericValueService,
    private accountService: ChequeService,
    private sendMoneyService: SendMoneyService,
    private sessionStorageService: SessionStorageService,
    private schedulePaymentService: SchedulePaymentService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.matIconRegistry.addSvgIcon(
      `calendar-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/calendar.svg',
      ),
    );
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.payeeDetails = navigation.extras.state['paymentDetails'];
      if (this.payeeDetails) {
        this.proceedTransferMoney = true;
        this.accountNo =
          this.payeeDetails?.[0]?.payerDetails?.accountNo ??
          this.payeeDetails?.accountNo;
      }
    }
  }

  async ngOnInit() {
    this.buildTransferMoney();
    this.loadUserProfile();
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.fetchGenericValue();
    this.getFavouritiesData();
    this.fetchingDetails = await this.serviceCallHandler.get(
      'serviceHandler',
      true,
    );
    this.currencyCode = this.profileInfo.branchCrncyCode;

    if (this.fetchingDetails) {
      if (this.fetchingDetails?.creditAccount) {
        this.transferMoneyForm
          .get('creditAccount')
          ?.setValue(this.fetchingDetails?.creditAccount);
        this.proceedTransferMoney = true;
      }

      if (this.fetchingDetails?.creditAmount) {
        this.transferMoneyForm
          .get('creditAmount')
          ?.setValue(this.fetchingDetails?.creditAmount);
      }

      if (this.fetchingDetails?.paymentMode) {
        this.transferMoneyForm
          .get('paymentMode')
          ?.setValue(this.fetchingDetails?.paymentMode);
      }

      if (this.fetchingDetails?.remarks) {
        this.transferMoneyForm
          .get('remark')
          ?.setValue(this.fetchingDetails?.remarks);
      }
    }
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  buildTransferMoney() {
    this.transferMoneyForm = this.fb.group({
      debitAccount: ['', [Validators.required]],
      debitAccountType: [''],
      creditAccount: [this.accountNo ?? '', [Validators.required]],
      creditAccountType: [''],
      creditAccountName: [''],
      bankId: [''],
      creditAmount: [''],
      debitAmount: [''],
      paymentMode: [''],
      paymentType: ['Same'],
      transferType: 'Transfer Money',
      recurringPayment: [''],
      schedulePaymentDate: [''],
      frequency: [''],
      noOfInstalment: [''],
      remark: [''],
      source: 'I',
      payeeName: '',
      amount: [''],
      corpCustomerId: [],
      corpBeneficiaryId: [],
    });
  }

  proceedToTransferMoney(event?: any) {
    if (event) {
      this.transferMoneyForm.get('creditAccount')?.patchValue(event?.accountNo);
      this.transferMoneyForm.get('amount')?.patchValue(event?.account);
    }
    if (
      !this.transferMoneyForm.get('creditAccount')?.value &&
      !this.transferMoneyForm.get('debitAccount')?.value
    ) {
      this.transferMoneyForm.get('debitAccount')?.touched;
      this.transferMoneyForm.get('creditAccount')?.touched;
    } else this.proceedTransferMoney = true;
  }
  changeFav(eve: any) {
    this.filterFav = [];
    this.transferType.forEach((res) => {
      if (res?.bankType == eve && res?.isFavorite == true) {
        this.filterFav.push(res);
      }
    });
  }
  getFavouritiesData() {
    this.sendMoneyService.fetchPayeeList().subscribe((res: any) => {
      if (res?.statusCode === 200) {
        this.transferType = res?.data;
        this.transferType.forEach((res) => {
          if (res?.isFavorite == true) {
            this.filterFav.push(res);
          }
        });
      }
    });
  }

  fetchGenericValue() {
    this.genericValueService
      .loadGenericValue('Common', Object.keys(this.staticData))
      .subscribe((res: any) => {
        this.genericValue = res?.data;
      });
  }

  payAccount(event: any) {
    const listOfAccounts = this.sessionStorageService.getListOfAccounts();
    this.accountType = listOfAccounts?.find(
      (res) => res?.accountNo == event,
    )?.accountType;
    this.selectedCurrency = listOfAccounts.find(
      (res) => res?.accountNo == event,
    )?.accountCurrency;
  }

  setTransfer(event: any) {
    this.selectedTransferAccount = this.transferType.find(
      (res) => res?.accountNo == event || event?.accountNo,
    );
    console.log(this.selectedTransferAccount);
    this.accountService
      .fetchInfoByoriginationAccNo(this.selectedTransferAccount?.accountNo)
      .subscribe((res) => {
        if (res?.statusCode === 200 && res?.data?.length > 0) {
          const data = res?.data[0];
          this.bankName = data?.bankName;
          this.accountType = data?.accountType;
        }
      });
  }

  goBack() {
    console.log('1');
    this.proceedTransferMoney = !this.proceedToTransferMoney;
  }

  submit() {
    console.log(this.transferMoneyForm);
    if (!this.transferMoneyForm?.valid) return;
    const payload = { ...this.transferMoneyForm.value };
    payload.payeeName = this.customerInfo?.customerName;
    const paymentMode = this.genericValue?.PAYMENTMODE.find(
      (res: any) => this.transferMoneyForm.get('paymentMode')?.value == res?.id,
    )?.values;
    const frequency = this.genericValue?.SCHEDULEPAYMENT.find(
      (res: any) => this.transferMoneyForm.get('frequency')?.value == res?.id,
    )?.values;
    payload.bankId = this.profileInfo.bankId;
    payload.corpCustomerId = this.customerInfo.customerId;
    payload.debitAmount = payload.creditAmount;
    payload.corpBeneficiaryId = this.selectedTransferAccount?.id;
    console.log(payload);
    if (payload?.paymentType == 'later') payload.amount = payload?.creditAmount;
    else delete payload.amount;
    const paymentDetailsArr = [
      {
        eventType: 'mmidTransfer',
        operationType: 'Transfer_Money',
        status: 'confirm',
        masterId: 'retailFundTransferMasterId',
        statusHeader: 'Comfirm Payment',
        statusNews: 'Payment sent successfully!',
        summary: [
          {
            header: 'Send From',
            details: [
              { Name: this.customerInfo?.customerName },
              {
                'Account No': this.transferMoneyForm.get('debitAccount')?.value,
              },
              { 'Account Type': this.customerInfo?.accounts[0]?.accountType },
            ],
          },
          {
            header: 'Send To',
            details: [
              { Name: this.selectedTransferAccount?.payeeName },
              {
                'Account No':
                  this.transferMoneyForm.get('creditAccount')?.value,
              },
              {
                'Account Type': this.accountType,
              },
              {
                'Bank Name': this.bankName,
              },
              { 'Bank Code': this.selectedTransferAccount?.bankCode },
              { Amount: this.transferMoneyForm.get('creditAmount')?.value },
              {
                'Payment Mode': paymentMode,
              },
              this.transferMoneyForm.get('paymentType')?.value != 'now'
                ? {
                    'Schedule Payment': moment(
                      new Date(
                        this.transferMoneyForm.get(
                          'schedulePaymentDate',
                        )?.value,
                      ),
                    ).format('DD-MM-YYYY'),
                  }
                : '',

              frequency ? { Frequency: frequency } : '',
              this.transferMoneyForm.get('noOfInstalment')?.value
                ? {
                    'No of instalments':
                      this.transferMoneyForm.get('noOfInstalment')?.value,
                  }
                : '',
              { Remarks: this.transferMoneyForm.get('remark')?.value },
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
        this.transferMoneyForm.get('paymentType')?.value == 'now'
          ? this.transferMoneyService.saveTransferMoney(payload)
          : this.schedulePaymentService.save(payload),
    );
    this.router.navigate(['/user/send-money/payment-summary']);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
