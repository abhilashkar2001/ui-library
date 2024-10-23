import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { loanServiceStore } from '../../../loan-tabs';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';

@Component({
  selector: 'app-repayment-schedule',
  templateUrl: './repayment-schedule.component.html',
  styleUrls: ['./repayment-schedule.component.scss']
})
export class RepaymentScheduleComponent implements OnInit {

  repaymentScheduleForm: FormGroup | undefined;
  fetchStatement: boolean = false;
  // loanDetails: LoanDetailsModel[];
  // Need to remove the static data
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

  loanAccountDetails = loanServiceStore.repaymentScheduleDetails;
  repaymentDetails: any;


  constructor(private fb: FormBuilder, private loanService: LoanService) { }

  ngOnInit(): void {
    this.buildDisbursementScheduleForm()
  }

  buildDisbursementScheduleForm() {
    this.repaymentScheduleForm = this.fb.group({
      debitAccount: [""],
    });


  }

  //fetch details of repayment schedule
  fetchRepaymentSchedule() {
    this.fetchStatement = true;
    this.loanService
      .fetchRepaymentSchedule(this.repaymentScheduleForm.value.debitAccount)
      .subscribe((res: IcHttpResponseModel<any>) => {
        if (res?.statusCode == 200 && res?.data)
          this.repaymentDetails = res?.data;
      });
  }
}
