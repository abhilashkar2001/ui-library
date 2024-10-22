import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanTopUpStore } from './topup-loan.store';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';

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
  loanDetails: LoanDetailsModel[];
  customerId: any;
  genericValue = { PURPOSE: [] };
  installmentDetails: LoanInstallmentModel;
  calculatedData: any;
  profileInfo: any;
  currentCurrency: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildTopUp();
    // this.fetchGenericValues();
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
  }


}
