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

@Component({
  selector: 'app-topup-loan',
  templateUrl: './topup-loan.component.html',
  styleUrls: ['./topup-loan.component.scss']
})
export class TopupLoanComponent implements OnInit {

  topUpForm: FormGroup | undefined;
  minTenure: number = 7;
  maxTenureInYears: number = 10;
  maxTenure: number = 3650;
  max = 100000;
  min = 5000;
  chartSectionDetails = LoanTopUpStore.ChartDetails;
  accountDetails = LoanTopUpStore.loanAccountDetails;
  customerId: any;
  genericValue = { PURPOSE: [] };
  installmentDetails: LoanInstallmentModel;
  calculatedData: any;
  profileInfo: any;
  currentCurrency: any;
  //need to remove the static data
  loanDetails = [
    {
      cbsAccountNumber: '300200003035',
      additionalValue: 'Value 1'
    },
    {
      cbsAccountNumber: '300200007504',
      additionalValue: 'Value 2'
    }
  ];

  constructor(private fb: FormBuilder, private genericValueService: GenericValueService, private loanService: LoanService) { }

  ngOnInit(): void {
    this.buildTopUp();
    this.fetchGenericValues();
  }

  //building the form
  buildTopUp() {
    this.topUpForm = this.fb.group({
      debitAccount: ["", [Validators.required]],
      debitCurrency: [""],
      tenureYear: ["", [Validators.required]],
      tenureMonth: ["", [Validators.required]],
      tenureDay: ["", [Validators.required]],
      purpose: [""],
      remarks: [""],
      tenure: [""],
      acceptTermsConditions: [""],
      topUpAmount: ["", [Validators.required]],
      transferType: "Top Up Loan",
      source: "I",
      customerId: this.customerId
    });

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
      .loadGenericValue("Common", Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k])
          );
        }
      });
  }

  //fetch installment details
  fetchLoanInstallment() {
    this.loanService
      .fetchLoanInstallment(this.topUpForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel>) => {
        if (res?.statusCode == 200 && res?.data)
          this.installmentDetails = res?.data;
      });
  }


  //when the input values changes, slider value changes
  onInputChange(e, value) {
    if (value == "tenure") {
      let year = this.topUpForm.value.tenureYear;
      let month = this.topUpForm.value.tenureMonth;
      let day = this.topUpForm.value.tenureDay;
      const totalDays = year * 365 + month * 30 + day * 1;
      this.topUpForm.get("tenure").setValue(totalDays);
    } else this.topUpForm.get("topUpAmount").setValue(e);
  }



  //on the slider change, the input values should change
  onSliderChange(e, value) {
    if (value == "tenure") {
      let maxTenure = e.value;
      let years = Math.floor(maxTenure / 365);
      let remainingDays = maxTenure % 365;
      let months = Math.floor(remainingDays / 30);
      remainingDays = remainingDays % 30;
      this.topUpForm.get("tenureYear").setValue(years);
      this.topUpForm.get("tenureMonth").setValue(months);
      this.topUpForm.get("tenureDay").setValue(remainingDays);
    } else this.topUpForm.get("topUpAmount").setValue(e?.value);
  }


  /**
   * calculate the tenure 
   */
  calculateTenure() {
    let numberOfMonths =
      this.topUpForm.value.tenureYear * 12 + this.topUpForm.value.tenureMonth;
    let payload = {
      firstRepaymentDate: new Date(),
      interestRate: this.installmentDetails?.interestRate,
      numberOfMonths: numberOfMonths,
      principleAmount: this.topUpForm.value.topUpAmount
    };
    this.loanService.calculateEMI(payload).subscribe((res: any) => {
      this.calculatedData = {
        ...res?.data,
        maturityAmount: res?.data?.monthlyPayment,
        depositAmount: this.installmentDetails?.emiAmount,
        currentMaturityDate: this.installmentDetails?.maturityDate,
        currentInterest: this.installmentDetails?.totalInterest
      };
    });
  }

  getDecimalValue(value: number) {
    return new Decimal(
      removeSpecCharsOnly(this.currentCurrency?.thousandsSeparator, value || 0)
    );
  }





}
