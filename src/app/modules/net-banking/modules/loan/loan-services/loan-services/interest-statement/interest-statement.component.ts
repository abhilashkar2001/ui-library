import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { InterestStatementStore } from './interest-statement.store';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-interest-statement',
  templateUrl: './interest-statement.component.html',
  styleUrls: ['./interest-statement.component.scss']
})
export class InterestStatementComponent implements OnInit {
  interestStatementForm: FormGroup;
  yearDurationArr = InterestStatementStore.yearDuration;
  interestStatementheadings = InterestStatementStore.interestStatementheadings;
  fetchStatement: boolean = false;
  loanDetails: LoanDetailsModel[]
  interestStatement: any;

  constructor(private fb: FormBuilder,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService) { }

  ngOnInit(): void {
    this.loanDetails = this.sessionStorageService.getLoanInfo()
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
    this.interestStatementForm
      ?.get("debitAccount")
      ?.setValue(this.loanDetails[0]?.cbsAccountNumber);
  }


  fetchData() {
    this.fetchStatement = true;
    let payload;
    if (this.interestStatementForm.get("statementOption").value === "Duration")
      payload = `&fromDate=${this.interestStatementForm.value.statementFrom}&toDate=${this.interestStatementForm.value.statementTo}`;
    else
      payload = `&financialYear=${this.interestStatementForm.value.yearDuration}`;
    this.loanService
      .fetchInterestStatement(
        this.interestStatementForm.value.debitAccount,
        payload
      )
      .subscribe((res: IcHttpResponseModel<any>) => {
        if (res?.statusCode && res?.data)
          this.interestStatement = res?.data;
        console.log(this.interestStatement, 'checkkk');

      });
  }


}
