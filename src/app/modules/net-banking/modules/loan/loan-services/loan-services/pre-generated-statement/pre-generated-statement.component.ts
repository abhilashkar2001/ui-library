import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-pre-generated-statement',
  templateUrl: './pre-generated-statement.component.html',
  styleUrls: ['./pre-generated-statement.component.scss']
})
export class PreGeneratedStatementComponent implements OnInit {
  preGeneratedStatementForm: FormGroup;
  loanDetails: LoanDetailsModel[]
  installmentDetails: LoanInstallmentModel;
  preGeneratedDetails: any;

  constructor(private fb: FormBuilder, private loanService: LoanService, private sessionStorageService: SessionStorageService) { }

  ngOnInit(): void {
    this.loanDetails = this.sessionStorageService.getLoanInfo()
    this.buildPreGeneratedStatementForm()
  }

  buildPreGeneratedStatementForm() {
    this.preGeneratedStatementForm = this.fb.group({
      debitAccount: [""],
    });
    this.preGeneratedStatementForm.get('debitAccount').setValue(this.loanDetails[0]?.cbsAccountNumber)
    this.fetchLoanInstallment()
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

  /**
   * fetch the pregenerated loan details
   */
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
