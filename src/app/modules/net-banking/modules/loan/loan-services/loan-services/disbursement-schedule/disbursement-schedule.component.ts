import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { loanServiceStore } from '../../../loan-tabs';

@Component({
  selector: 'app-disbursement-schedule',
  templateUrl: './disbursement-schedule.component.html',
  styleUrls: ['./disbursement-schedule.component.scss']
})
export class DisbursementScheduleComponent implements OnInit {
  disbursementScheduleForm: FormGroup;
  disbursementList = loanServiceStore.disbursementList;
  disbursementStatementColumns =
    loanServiceStore.disbursementStatementColumns;
  disbursementRecords: any;
  fetchStatement: boolean = false;
  loanDetails: LoanDetailsModel[];
  fetchedData: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildDisbursementScheduleForm()
  }

  buildDisbursementScheduleForm() {
    this.disbursementScheduleForm = this.fb.group({
      loanAccNo: [""],
    });

  }

}
