import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { loanServiceStore } from '../../../loan-tabs';

@Component({
  selector: 'app-repayment-schedule',
  templateUrl: './repayment-schedule.component.html',
  styleUrls: ['./repayment-schedule.component.scss']
})
export class RepaymentScheduleComponent implements OnInit {

  repaymentScheduleForm: FormGroup | undefined;
  fetchStatement: boolean = false;
  loanDetails: LoanDetailsModel[];
  loanAccountDetails = loanServiceStore.repaymentScheduleDetails;
  repaymentDetails: any;


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildDisbursementScheduleForm()
  }

  buildDisbursementScheduleForm() {
    this.repaymentScheduleForm = this.fb.group({
      debitAccount: [""],
    });

  }
}
