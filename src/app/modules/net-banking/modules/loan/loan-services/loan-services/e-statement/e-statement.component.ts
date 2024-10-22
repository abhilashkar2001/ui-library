import { Component, OnInit } from '@angular/core';
import { loanServiceStore } from '../../../loan-tabs';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-e-statement',
  templateUrl: './e-statement.component.html',
  styleUrls: ['./e-statement.component.scss']
})
export class EStatementComponent implements OnInit {

  estatementForm!: FormGroup;
  accNoArr = loanServiceStore.loanAccNoArr;
  freqArr = loanServiceStore.frequencyArr;
  formatArr = loanServiceStore.formatArr;
  loanDetails: LoanDetailsModel[];
  installmentDetails: LoanInstallmentModel;
  genericValue = { FREQUENCY: [], FORMAT: [] };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildeStatementForm()
  }


  buildeStatementForm() {
    this.estatementForm = this.fb.group({
      accountNumber: [""],
      loanType: [""],
      email: [""],
      frequency: [""],
      format: [""],
    });
  }
}
