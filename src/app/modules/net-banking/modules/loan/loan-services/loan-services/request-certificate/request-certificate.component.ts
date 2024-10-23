import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { loanServiceStore } from '../../../loan-tabs';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';

@Component({
  selector: 'app-request-certificate',
  templateUrl: './request-certificate.component.html',
  styleUrls: ['./request-certificate.component.scss']
})
export class RequestCertificateComponent implements OnInit {
  requestCertificateForm: FormGroup;
  requestCertificateheadings =
    loanServiceStore.requestCertificateheadings;
  fetchStatement: Boolean = false;
  // loanDetails: LoanDetailsModel[];
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
  requestOptions = [
    "Offer Letter",
    "Annual Loan Statement",
    "Final Interest Certificate",
    "Closure Letter",
  ];
  installmentDetails: LoanInstallmentModel;

  constructor(private fb: FormBuilder, private loanService: LoanService) { }

  ngOnInit(): void {
    this.buildRequestCertificateForm()
  }

  //building the form
  buildRequestCertificateForm() {
    this.requestCertificateForm = this.fb.group({
      requestOption: ["", [Validators.required]],
      debitAccount: ["", [Validators.required]],
    });
  }


  onClick() {
    this.fetchStatement = true;
    this.loanService
      .fetchLoanInstallment(this.requestCertificateForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel>) => {
        if (res?.statusCode == 200 && res?.data)
          this.installmentDetails = res?.data;
      });
  }

}
