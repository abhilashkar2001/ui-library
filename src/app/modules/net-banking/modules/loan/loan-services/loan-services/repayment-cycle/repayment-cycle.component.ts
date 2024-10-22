import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';

@Component({
  selector: 'app-repayment-cycle',
  templateUrl: './repayment-cycle.component.html',
  styleUrls: ['./repayment-cycle.component.scss']
})
export class RepaymentCycleComponent implements OnInit {
  repaymentCycleForm: FormGroup;
  // loanAccNoArr = RepaymentCycleStore.loanAccNo;
  // repayRequestArr = RepaymentCycleStore.repayRequest;
  loanDetails: LoanDetailsModel[];
  installmentDetails: LoanInstallmentModel;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildRepaymentCycleForm()
  }

  buildRepaymentCycleForm() {
    this.repaymentCycleForm = this.fb.group({
      debitAccount: [""],
      debitCurrency: [""],
      currentRepayment: [""],
      repayRequest: [""],
    });

  }
}
