import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';

@Component({
  selector: 'app-pre-generated-statement',
  templateUrl: './pre-generated-statement.component.html',
  styleUrls: ['./pre-generated-statement.component.scss']
})
export class PreGeneratedStatementComponent implements OnInit {
  preGeneratedStatementForm: FormGroup;
  // loanAccNoArr = PreGeneratedStatementStore.loanAccNo;
  // loanDetails: any[];
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
  installmentDetails: LoanInstallmentModel;
  preGeneratedDetails: any;

  constructor(private fb: FormBuilder, private loanService: LoanService,) { }

  ngOnInit(): void {
    this.buildPreGeneratedStatementForm()
  }

  buildPreGeneratedStatementForm() {
    this.preGeneratedStatementForm = this.fb.group({
      debitAccount: [""],
    });

  }

  //fetch installment details
  fetchLoanInstallment() {
    this.loanService
      .fetchLoanInstallment(this.preGeneratedStatementForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel>) => {
        if (res?.statusCode == 200 && res?.data)
          this.installmentDetails = res?.data;
        this.fetchPreGenerated();
      });
  }

  fetchPreGenerated() {
    this.loanService
      .fetchPreGenerated(this.preGeneratedStatementForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<any>) => {
        if (res?.statusCode == 200 && res?.data) {
          this.preGeneratedDetails = res?.data;
        }
      });
  }


}
