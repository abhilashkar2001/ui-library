import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { loanServiceStore } from '../../../loan-tabs';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { handleDownload } from 'app/shared/helpers/utils';
import { EmailService } from 'app/shared/services/email.service';

@Component({
  selector: 'app-request-certificate',
  templateUrl: './request-certificate.component.html',
  styleUrls: ['./request-certificate.component.scss'],
})
export class RequestCertificateComponent implements OnInit {
  requestCertificateForm: FormGroup | any;
  requestCertificateheadings = loanServiceStore.requestCertificateheadings;
  fetchStatement = false;
  // loanDetails: LoanDetailsModel[];
  loanDetails: LoanDetailsModel[] | any;
  requestOptions = [
    'Offer Letter',
    'Annual Loan Statement',
    'Final Interest Certificate',
    'Closure Letter',
  ];
  installmentDetails: LoanInstallmentModel | any;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
    private emailService: EmailService,
  ) {}

  ngOnInit(): void {
    this.loanDetails = this.sessionStorageService.getLoanInfo();
    this.buildRequestCertificateForm();
  }

  //building the form
  buildRequestCertificateForm() {
    this.requestCertificateForm = this.fb.group({
      requestOption: ['', [Validators.required]],
      debitAccount: ['', [Validators.required]],
    });
    this.requestCertificateForm
      .get('debitAccount')
      ?.setValue(this.loanDetails[0]?.cbsAccountNumber);
  }

  onClick() {
    this.fetchStatement = true;
    this.loanService
      .fetchLoanInstallment(this.requestCertificateForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel> | any) => {
        if (res?.statusCode == 200 && res?.data)
          this.installmentDetails = res?.data;
      });
  }

  /**
   * Download the request certificate method
   * @param selectedOption
   * @param value
   */
  downloadCertificate(selectedOption: any, value: any) {
    const accNo = this.requestCertificateForm?.value?.debitAccount;
    let response;
    if (selectedOption == 'Offer Letter')
      this.loanService.downloadOfferLetter(accNo).subscribe((res: any) => {
        response = res;
      });
    else if (selectedOption == 'Annual Loan Statement')
      this.loanService.downloadLoanSummary(accNo).subscribe((res: any) => {
        response = res;
      });
    else if (selectedOption == 'Final Interest Certificate')
      this.loanService
        .downloadFinalInterestCertificate(accNo)
        .subscribe((res: any) => {
          response = res;
        });
    else if (selectedOption == 'Closure Letter')
      this.loanService.downloadClosureLetter(accNo).subscribe((res: any) => {
        response = res;
      });
    if (value == 'download') handleDownload(response, selectedOption);
    else this.share(response, selectedOption);
  }

  /**
   * Share the request certificate method
   * @param res
   * @param option
   */
  share(res: any, option: any) {
    const pdf = new Blob([res], { type: 'application/pdf' });
    const pdfFile = new File([pdf], `${option}.pdf`, {
      type: 'application/pdf',
    });
    const formData = new FormData();
    formData.append('subject', option);
    formData.append(
      'body',
      'Please find the attachment for you Request Certificate',
    );
    formData.append('to', 'sanjana.j@rumango.com');
    formData.append('filePath', pdfFile, pdfFile.name);
    this.emailService
      .triggerTransactionEmail(formData)
      .subscribe((res) => console.log(res));
  }
}
