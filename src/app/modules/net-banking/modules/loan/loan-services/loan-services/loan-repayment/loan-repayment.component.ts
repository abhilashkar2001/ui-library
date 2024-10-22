import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanRepaymentStore } from './loan-repayment.store';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';

@Component({
  selector: 'app-loan-repayment',
  templateUrl: './loan-repayment.component.html',
  styleUrls: ['./loan-repayment.component.scss']
})
export class LoanRepaymentComponent implements OnInit {
  repaymentForm: FormGroup | undefined;
  accountDetails = LoanRepaymentStore.loanAccountDetails;
  loanDetails = [
    {
      cbsAccountNumber: '1234567890',
      additionalValue: 'Value 1'
    },
    {
      cbsAccountNumber: '0987654321',
      additionalValue: 'Value 2'
    }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildLoanRepayment()
  }

  buildLoanRepayment() {
    this.repaymentForm = this.fb.group({
      debitAccount: [""],
      paymentType: [""],
      creditAccount: [""],
      creditAmount: [""],
      creditCurrency: [""],
      totalChargeAmount: [""],
      totalTransactionAmount: [""],
      debitCurrency: [""],
      transferType: "Loan Repayment",
      source: "I",
      exchangeRate: [""],
      equivalentAmount: [""],
    });
  }

}
