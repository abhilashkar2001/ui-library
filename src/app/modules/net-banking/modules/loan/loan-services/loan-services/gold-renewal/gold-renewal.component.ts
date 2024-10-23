import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { LoanTopUpStore } from '../topup-loan/topup-loan.store';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { removeSpecCharsOnly } from 'app/shared/helpers/utils';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';

@Component({
  selector: 'app-gold-renewal',
  templateUrl: './gold-renewal.component.html',
  styleUrls: ['./gold-renewal.component.scss']
})
export class GoldRenewalComponent implements OnInit {
  goldRenewalForm: FormGroup | undefined;
  accountDetails = LoanTopUpStore.loanAccountDetails;
  chartSectionDetails = LoanTopUpStore.ChartDetails;
  minTenure: number = 3;
  maxTenureInYears: number = 2;
  maxTenure: number = 730;
  renewalAmount: number[] = [100, 50, 25];
  // loanDetails: LoanDetailsModel[];
  // need to remove the static data
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

  customerId: any;
  installmentDetails: LoanInstallmentModel;
  calculatedData: any;
  amount: number;
  profileInfo: any;
  currentCurrency: any;

  constructor(private loanService: LoanService, private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.buildGoldRenewal();
  }

  //building the form
  buildGoldRenewal() {
    this.goldRenewalForm = this.fb.group({
      debitAccount: ["", [Validators.required]],
      tenureYear: ["", [Validators.required]],
      tenureMonth: ["", [Validators.required]],
      tenureDay: ["", [Validators.required]],
      tenure: [""],
      renewalAmount: ["", [Validators.required]],
      transferType: "Gold Renewal",
      source: "I",
      customerId: this.customerId
    });
    this.goldRenewalForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        console.log(this.goldRenewalForm);
        if (this.goldRenewalForm.valid) this.calculateTenure();
      });
  }


  //when the input values changes, slider value changes
  onInputChange() {
    let year = this.goldRenewalForm.value.tenureYear;
    let month = this.goldRenewalForm.value.tenureMonth;
    let day = this.goldRenewalForm.value.tenureDay;
    const totalDays = year * 365 + month * 30 + day * 1;
    this.goldRenewalForm.get("tenure").setValue(totalDays);
  }

  //on the slider change, the input values should change
  onSliderChange(e) {
    let maxTenure = e.value;
    let years = Math.floor(maxTenure / 365);
    let remainingDays = maxTenure % 365;
    let months = Math.floor(remainingDays / 30);
    remainingDays = remainingDays % 30;
    this.goldRenewalForm.get("tenureYear").setValue(years);
    this.goldRenewalForm.get("tenureMonth").setValue(months);
    this.goldRenewalForm.get("tenureDay").setValue(remainingDays);
  }

  getDecimalValue(value: string) {
    return removeSpecCharsOnly(
      this.currentCurrency?.thousandsSeparator,
      value || 0
    );
  }

  //fetch installment details
  fetchLoanInstallment() {
    this.loanService
      .fetchLoanInstallment(this.goldRenewalForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel>) => {
        if (res?.statusCode == 200 && res?.data)
          this.installmentDetails = res?.data;
      });
  }

  //calculate the gold new renewal
  calculateTenure() {
    let numberOfMonths =
      this.goldRenewalForm.value.tenureYear * 12 +
      this.goldRenewalForm.value.tenureMonth;
    this.amount =
      (this.goldRenewalForm.value.renewalAmount / 100) *
      this.installmentDetails.loanAmount +
      this.installmentDetails.loanAmount;
    let payload = {
      firstRepaymentDate: new Date(),
      interestRate: this.installmentDetails?.interestRate,
      numberOfMonths: numberOfMonths,
      principleAmount: this.amount
    };
    this.loanService.calculateEMI(payload).subscribe((res: any) => {
      console.log(res);
      this.calculatedData = {
        ...res?.data,
        maturityAmount: res?.data?.monthlyPayment,
        depositAmount: this.installmentDetails?.emiAmount,
        currentMaturityDate: this.installmentDetails?.maturityDate,
        currentInterest: this.installmentDetails?.totalInterest
      };
    });
  }

}
