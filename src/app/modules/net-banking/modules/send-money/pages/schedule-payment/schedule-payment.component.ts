import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Decimal from 'decimal.js';
import { SchedulePaymentService } from 'app/shared/services/fund-transfer/schedule-payment.service';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { TokenStorageService } from 'app/shared/token-storage.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { SendMoneyService } from 'app/shared/services/fund-transfer/send-money.service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { findCurrency, removeSpecCharsOnly } from 'app/shared/helpers/utils';
import { IconService } from 'app/shared/services/icon.service';

@Component({
  selector: 'app-schedule-payment',
  templateUrl: './schedule-payment.component.html',
  styleUrls: ['./schedule-payment.component.scss'],
})
export class SchedulePaymentComponent implements OnInit {
  schedulePaymentForm: FormGroup | any;
  paymentModes: any[] = [];
  options: any[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  frequncyData: any[] = [];
  proceedPayment = false;
  payFromData: any;
  transferData: any;
  mobileNo = '';
  profileInfo: any;
  debitAccData: any;
  debitAccCurr: any;
  message: any;
  customerId: number | any;
  genericData = {
    FREQUENCY: [],
    PAYMENTMODE: [],
  };
  filterFav: any[] = [];
  selectedAccNo: any;
  transferToData: any;
  customerInfo: any;
  selectedCurrency: any;
  currentCurrency: any;

  constructor(
    private fb: FormBuilder,
    private service: SchedulePaymentService,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private tokenService: TokenStorageService,
    private sendMoneyService: SendMoneyService,
    private genericValueService: GenericValueService,
    private sessionStorageService: SessionStorageService,
    private iconService: IconService,
  ) {
    this.currentCurrency = findCurrency(this.profileInfo?.branchCrncyCode);
    this.iconService
      .addIconIfNotExists('calendar-icon', 'assets/images/calendar.svg')
      .subscribe(() => {});
  }

  ngOnInit(): void {
    this.profileInfo = this.tokenService.getUser();
    const customerInfo = this.sessionStorageService.getCustomerInfo();
    this.mobileNo = customerInfo?.mobileNumber;
    this.customerId = customerInfo?.customerId;
    this.buildForm();
    this.fetchGenericValues();
    this.getFavouritiesData();
    this.fetchPayFrom();
  }
  changeFav(eve: any) {
    this.filterFav = [];
    this.transferData.forEach((res: any) => {
      if (res?.bankType == eve && res?.isFavorite == true) {
        this.filterFav.push(res);
      }
    });
  }

  getFavouritiesData() {
    this.sendMoneyService.fetchPayeeList().subscribe((res: any) => {
      if (res?.statusCode === 200) {
        this.transferData = res.data;
        this.transferData.forEach((res: any) => {
          if (res?.isFavorite == true) {
            this.filterFav.push(res);
          }
        });
      }
    });
  }
  selectTransfer(event: any) {
    console.log(event);
    this.selectedAccNo = this.transferData.find(
      (res: any) => (res.accountNo = event ?? event?.accountNo),
    );
    console.log(this.selectedAccNo);
    this.message = 'Bank Code - ' + this.selectedAccNo.bankCode;
    this.service
      .fetchInfoByoriginationAccNo(this.selectedAccNo?.accountNo)
      .subscribe((res) => {
        if (res?.statusCode === 200 && res?.data?.length > 0) {
          this.transferToData = res?.data[0];
        }
      });
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue('Common', Object.keys(this.genericData))
      .subscribe((res: any) => {
        if (res?.statusCode == 200) {
          this.frequncyData = res.data.FREQUENCY;
          this.paymentModes = res.data.PAYMENTMODE;
        }
      });
  }
  buildForm() {
    this.schedulePaymentForm = this.fb.group({
      debitAccount: ['', Validators.required],
      debitAccountType: [],
      creditAccount: [],
      creditAccountType: [],
      creditAccountName: [],
      source: ['I'],
      bankId: [],
      amount: ['', Validators.required],
      paymentMode: [],
      schedulePaymentDate: [],
      recurringPayment: [],
      frequency: [],
      noOfInstalment: [],
      remark: [],
      paymentType: [],
      payeeName: [],
      transferType: 'Schedule Payment',
      corpCustomerId: [],
      corpBeneficiaryId: [],
    });
  }
  payAccount(value: any) {
    const listOfAccounts = this.sessionStorageService.getListOfAccounts();
    this.selectedCurrency = listOfAccounts.find(
      (res) => res?.accountNo == value,
    )?.accountCurrency;
  }
  getCustomerInfo() {
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
  }
  fetchPayFrom() {
    if (this.customerInfo) {
      this.payFromData = this.customerInfo?.accounts?.[0].accountList;
    }
  }
  getDecimalValue(value: number) {
    return new Decimal(
      removeSpecCharsOnly(this.currentCurrency?.thousandsSeparator, value || 0),
    );
  }
  submit() {
    if (this.schedulePaymentForm.invalid) {
      this.schedulePaymentForm.markAllAsTouched();
      return;
    }
    const creditAcc = this.schedulePaymentForm.get('creditAccount')?.value;
    const transferTo = this.transferData.find(
      (item: any) => item.accountNo === creditAcc,
    );
    const payload = { ...this.schedulePaymentForm.value };
    payload.creditAccountName = transferTo?.payeeName;
    payload.payeeName = transferTo?.payeeName;
    payload.creditAccountType = transferTo?.bankType;
    payload.bankId = this.profileInfo?.bankId;
    payload.corpCustomerId = this.customerId;
    payload.debitAccountType = this.transferToData.accountType;
    payload.corpBeneficiaryId = transferTo?.id;
    const paymentVal = this.schedulePaymentForm.get('paymentMode')?.value;
    const paymentModeVal = this.paymentModes.find(
      (item) => item.id === paymentVal,
    );
    const frequencyVal = this.schedulePaymentForm.get('frequency')?.value;
    const frequencyValues = this.frequncyData.find(
      (item) => item.id === frequencyVal,
    );
    const paymentDetailsArr = [
      {
        eventType: 'mmidTransfer',
        operationType: 'Schedule_Payment',
        status: 'confirm',
        masterId: 'retailFundTransferMasterId',
        statusHeader: 'Comfirm Payment',
        statusNews: 'Payment Scheduled!',
        summary: [
          {
            header: 'Send From',
            details: [
              { Name: this.customerInfo?.customerName },
              {
                'Account No':
                  this.schedulePaymentForm.get('debitAccount')?.value,
              },
              { 'Account Type': 'Savings' },
            ],
          },
          {
            header: 'Send To',
            details: [
              { Name: transferTo?.payeeName },
              {
                'Account No':
                  this.schedulePaymentForm.get('creditAccount')?.value,
              },
              {
                'Account Type': this.transferToData.accountType,
              },
              { 'Bank Name': this.transferToData?.bankName },
              { 'Bank Code': this.transferToData?.bankCode },
              {
                Amount: this.getDecimalValue(
                  this.schedulePaymentForm.get('amount')?.value,
                ),
              },
              {
                'Payment Mode': paymentModeVal?.values,
              },
              {
                'Schedule Payment': this.schedulePaymentForm.get(
                  'schedulePaymentDate',
                )?.value,
              },
              { Frequency: frequencyValues?.values },
              {
                'No of instalments':
                  this.schedulePaymentForm.get('noOfInstalment')?.value,
              },
              { Remarks: this.schedulePaymentForm.get('remark')?.value },
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
      (payload) => this.service.save(payload),
    );
    this.router.navigate(['/user/send-money/payment-summary'], {});
  }

  proceed(value: any) {
    const DebitValue = this.schedulePaymentForm?.get('creditAccount')?.value
      ? this.schedulePaymentForm?.get('creditAccount')?.value
      : value?.accountNo;
    this.schedulePaymentForm?.get('creditAccount')?.patchValue(DebitValue);
    this.schedulePaymentForm?.get('amount')?.patchValue(value?.account);
    this.proceedPayment = true;
  }
  close() {
    this.proceedPayment = false;
    this.currentCurrency = findCurrency(this.profileInfo?.branchCrncyCode);
  }
}
