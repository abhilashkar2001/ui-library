import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanTopUpStore } from './topup-loan.store';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { removeSpecCharsOnly } from 'app/shared/helpers/utils';
import Decimal from 'decimal.js';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { Router } from '@angular/router';
import { ServiceCallHandler } from 'app/shared/services/service-call.handler';

@Component({
  selector: 'app-topup-loan',
  templateUrl: './topup-loan.component.html',
  styleUrls: ['./topup-loan.component.scss'],
})
export class TopupLoanComponent implements OnInit {
  topUpForm: FormGroup | any;
  minTenure = 7;
  maxTenureInYears = 10;
  maxTenure = 3650;
  max = 100000;
  min = 5000;
  chartSectionDetails = LoanTopUpStore.ChartDetails;
  accountDetails = LoanTopUpStore.loanAccountDetails;
  genericValue: any = { PURPOSE: [] };
  installmentDetails: LoanInstallmentModel | any;
  calculatedData: any;
  profileInfo: any;
  currentCurrency: any;
  loanDetails: LoanDetailsModel[] | any;
  corpCustId: number | any;

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
  ) {}

  ngOnInit(): void {
    this.corpCustId = this.sessionStorageService.getCustomerInfo()?.customerId;
    this.loanDetails = this.sessionStorageService.getLoanInfo();
    this.buildTopUp();
    this.fetchGenericValues();
  }

  //building the form
  buildTopUp() {
    this.topUpForm = this.fb.group({
      debitAccount: ['', [Validators.required]],
      debitCurrency: [''],
      tenureYear: ['', [Validators.required]],
      tenureMonth: ['', [Validators.required]],
      tenureDay: ['', [Validators.required]],
      purpose: [''],
      remarks: [''],
      tenure: [''],
      acceptTermsConditions: [''],
      topUpAmount: ['', [Validators.required]],
      transferType: 'Top Up Loan',
      source: 'I',
      corpCustomerId: this.corpCustId,
    });

    this.topUpForm
      .get('debitAccount')
      .setValue?.(this.loanDetails[0]?.cbsAccountNumber);
    this.fetchLoanInstallment();
    this.topUpForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        if (this.topUpForm.valid) this.calculateTenure();
      });
  }

  /**
   * Fetch genericvalues
   */
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k]),
          );
        }
      });
  }

  //fetch installment details
  fetchLoanInstallment() {
    this.loanService
      .fetchLoanInstallment(this.topUpForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel> | any) => {
        if (res?.statusCode == 200 && res?.data)
          this.installmentDetails = res?.data;
      });
  }

  //when the input values changes, slider value changes
  onInputChange(e: any, value: any) {
    if (value == 'tenure') {
      const year = this.topUpForm.value.tenureYear;
      const month = this.topUpForm.value.tenureMonth;
      const day = this.topUpForm.value.tenureDay;
      const totalDays = year * 365 + month * 30 + day * 1;
      this.topUpForm.get('tenure').setValue(totalDays);
    } else this.topUpForm.get('topUpAmount').setValue(e);
  }

  //on the slider change, the input values should change
  onSliderChange(e: any, value: any) {
    if (value == 'tenure') {
      const maxTenure = e.value;
      const years = Math.floor(maxTenure / 365);
      let remainingDays = maxTenure % 365;
      const months = Math.floor(remainingDays / 30);
      remainingDays = remainingDays % 30;
      this.topUpForm.get('tenureYear').setValue(years);
      this.topUpForm.get('tenureMonth').setValue(months);
      this.topUpForm.get('tenureDay').setValue(remainingDays);
    } else this.topUpForm.get('topUpAmount').setValue(e?.value);
  }

  /**
   * calculate the tenure
   */
  calculateTenure() {
    const numberOfMonths =
      this.topUpForm?.value.tenureYear * 12 + this.topUpForm?.value.tenureMonth;
    const payload = {
      firstRepaymentDate: new Date(),
      interestRate: this.installmentDetails?.interestRate,
      numberOfMonths: numberOfMonths,
      principleAmount: this.topUpForm?.value.topUpAmount,
    };
    this.loanService.calculateEMI(payload).subscribe((res: any) => {
      this.calculatedData = {
        ...res?.data,
        maturityAmount: res?.data?.monthlyPayment,
        depositAmount: this.installmentDetails?.emiAmount,
        currentMaturityDate: this.installmentDetails?.maturityDate,
        currentInterest: this.installmentDetails?.totalInterest,
      };
    });
  }

  getDecimalValue(value: number) {
    return new Decimal(
      removeSpecCharsOnly(this.currentCurrency?.thousandsSeparator, value || 0),
    );
  }

  //save function to save the details
  saveTopUp() {
    const payload = { ...this.topUpForm?.value };
    payload.debitCurrency = this.loanDetails?.find(
      (res: any) =>
        res?.cbsAccountNumber == this.topUpForm?.value?.debitAccount,
    )?.currencyCode;
    delete payload.tenure;
    console.log(payload, 'payload');
    const topUpArr = [
      {
        eventType: 'topUp',
        operationType: 'Loan',
        status: 'details',
        masterId: 'benificiaryMasterId',
        statusHeader: 'Confirm Details',
        statusNews: 'Top Up Loan Request',
        summary: [
          {
            header: 'Loan Details',
            details: [
              { Name: this.installmentDetails?.customerName },
              {
                'Loan Account Number':
                  this.topUpForm?.get('debitAccount')?.value,
              },
              { Type: this.installmentDetails?.loanType },
              { 'Loan Amount': this.installmentDetails?.loanAmount },
              {
                'Outstanding Principal':
                  this.installmentDetails?.outstandPrincpl,
              },
              {
                'Interest Rate': this.installmentDetails?.interestRate,
              },
              {
                Duration: this.installmentDetails?.duration,
              },
              { 'Maturity Date': this.installmentDetails?.maturityDate },
              {
                'Remaining Installments':
                  this.installmentDetails?.remainingInstall,
              },
              { Status: this.installmentDetails?.status },
            ],
          },
          {
            header: 'Modify Tenure ',
            details: [
              {
                'Top up Amount': this.getDecimalValue(
                  this.topUpForm?.value.topUpAmount,
                ),
              },
              { Tenure: this.topUpForm?.value.tenureYear + 'Year' },
              { 'Account to be credited': '' },
              { Purpose: this.topUpForm?.value.purpose },
            ],
          },
        ],
      },
    ];
    this.serviceCallHandler.put(
      'serviceHandler',
      payload,
      topUpArr,
      (payload) => this.loanService.saveService(payload),
    );
    this.router.navigate(['/user/loan/loan-service/payment-summary']);
  }
}
