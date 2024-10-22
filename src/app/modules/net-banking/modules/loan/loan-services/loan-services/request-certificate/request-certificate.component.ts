import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { loanServiceStore } from '../../../loan-tabs';

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
  loanDetails: LoanDetailsModel[];
  requestOptions = [
    "Offer Letter",
    "Annual Loan Statement",
    "Final Interest Certificate",
    "Closure Letter",
  ];
  installmentDetails: LoanInstallmentModel;

  constructor(private fb: FormBuilder) { }

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

}
