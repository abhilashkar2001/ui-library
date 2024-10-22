import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { LoanTopUpStore } from '../topup-loan/topup-loan.store';

@Component({
  selector: 'app-modify-tenure',
  templateUrl: './modify-tenure.component.html',
  styleUrls: ['./modify-tenure.component.scss']
})
export class ModifyTenureComponent implements OnInit {
  modifyTenureForm!: FormGroup;
  minTenure: number = 7;
  maxTenureInYears: number = 10;
  maxTenure: number = 3650;
  chartSectionDetails = LoanTopUpStore.ChartDetails;
  accountDetails = LoanTopUpStore.loanAccountDetails;
  loanDetails: any;
  customerId: number;
  installmentDetails: LoanInstallmentModel;
  genericValue = { REASON: [] };
  calculatedData: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildModifyTenure();
  }


  //building the form
  buildModifyTenure() {
    this.modifyTenureForm = this.fb.group({
      debitAccount: [""],
      debitCurrency: [""],
      tenureYear: [""],
      tenureMonth: [""],
      tenureDay: [""],
      reason: [""],
      remarks: [""],
      tenure: [""],
      acceptTermsConditions: [""],
      transferType: "Modify Tenure",
      source: "I",
      customerId: this.customerId,
    });

  }


}
