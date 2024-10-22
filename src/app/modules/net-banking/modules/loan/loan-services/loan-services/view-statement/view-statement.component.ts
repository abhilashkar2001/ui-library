import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { loanServiceStore } from '../../../loan-tabs';

@Component({
  selector: 'app-view-statement',
  templateUrl: './view-statement.component.html',
  styleUrls: ['./view-statement.component.scss']
})
export class ViewStatementComponent implements OnInit {
  viewStatementForm: FormGroup;
  viewStatementHeadingsArr = loanServiceStore.viewStatementHeadings;
  fetchStatement: boolean = false;
  loanDetails: LoanDetailsModel[];
  fetchedData: any;

  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.buildViewStatementForm()
  }

  buildViewStatementForm() {
    this.viewStatementForm = this.fb.group({
      statementOption: ["Active Loan"],
      loanAccNo: ["", [Validators.required]],
      viewOption: [""],
    });
  }

}
