import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { loanServiceStore } from '../../../loan-tabs';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';

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
  // loanDetails: LoanDetailsModel[];
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

  fetchedData: any;

  constructor(private fb: FormBuilder, private loanService: LoanService,) { }

  ngOnInit(): void {
    this.buildDisbursementScheduleForm()
  }

  buildDisbursementScheduleForm() {
    this.disbursementScheduleForm = this.fb.group({
      loanAccNo: [""],
    });
  }

  onClick() {
    this.fetchStatement = true;
    this.loanService
      .fetchDisbursementSchedule(this.disbursementScheduleForm.value.loanAccNo)
      .subscribe((res: IcHttpResponseModel<any>) => {
        if (res?.statusCode == 200 && res?.data) {
          this.fetchedData = res?.data;
          this.disbursementRecords = res?.data?.childDetails;
        }
      });
  }

}
