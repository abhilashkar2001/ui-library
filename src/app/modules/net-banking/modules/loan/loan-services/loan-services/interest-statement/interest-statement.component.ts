import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { InterestStatementStore } from './interest-statement.store';

@Component({
  selector: 'app-interest-statement',
  templateUrl: './interest-statement.component.html',
  styleUrls: ['./interest-statement.component.scss']
})
export class InterestStatementComponent implements OnInit {
  interestStatementForm: FormGroup;
  loanAccNoArr = InterestStatementStore.loanAccNo;
  yearDurationArr = InterestStatementStore.yearDuration;
  interestStatementheadings = InterestStatementStore.interestStatementheadings;
  fetchStatement: boolean = false;
  loanDetails: LoanDetailsModel[];
  interestStatement: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildInterestStatementForm()
  }


  buildInterestStatementForm() {
    this.interestStatementForm = this.fb.group({
      debitAccount: [""],
      statementOption: ["Financial Year"],
      yearDuration: [""],
      statementFrom: [""],
      statementTo: [""],
    });

  }
}
