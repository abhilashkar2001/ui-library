import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';

@Component({
  selector: 'app-pre-generated-statement',
  templateUrl: './pre-generated-statement.component.html',
  styleUrls: ['./pre-generated-statement.component.scss']
})
export class PreGeneratedStatementComponent implements OnInit {
  preGeneratedStatementForm: FormGroup;
  // loanAccNoArr = PreGeneratedStatementStore.loanAccNo;
  loanDetails: any[];
  installmentDetails: LoanInstallmentModel;
  preGeneratedDetails: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildPreGeneratedStatementForm()
  }

  buildPreGeneratedStatementForm() {
    this.preGeneratedStatementForm = this.fb.group({
      debitAccount: [""],
    });

  }
}
