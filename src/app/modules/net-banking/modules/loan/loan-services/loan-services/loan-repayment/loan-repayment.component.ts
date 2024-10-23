import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanRepaymentStore } from './loan-repayment.store';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { GenericValueService } from 'app/shared/services/generic-value.service';

@Component({
  selector: 'app-loan-repayment',
  templateUrl: './loan-repayment.component.html',
  styleUrls: ['./loan-repayment.component.scss']
})
export class LoanRepaymentComponent implements OnInit {
  repaymentForm: FormGroup | undefined;
  accountDetails = LoanRepaymentStore.loanAccountDetails;
  genericValue = { PAYMENTTYPE: [] };
  //Need to remove the static data
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

  constructor(private fb: FormBuilder, private genericValueService: GenericValueService) { }

  ngOnInit(): void {
    this.buildLoanRepayment()
    this.fetchGenericValues()
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


  /**
   * Fetch the generic data
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
}
