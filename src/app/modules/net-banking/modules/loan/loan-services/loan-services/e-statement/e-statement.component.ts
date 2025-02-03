import { Component, OnInit } from '@angular/core';
import { loanServiceStore } from '../../../loan-tabs';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e-statement',
  templateUrl: './e-statement.component.html',
  styleUrls: ['./e-statement.component.scss'],
})
export class EStatementComponent implements OnInit {
  estatementForm!: FormGroup;
  accNoArr = loanServiceStore.loanAccNoArr;
  freqArr = loanServiceStore.frequencyArr;
  formatArr = loanServiceStore.formatArr;
  loanDetails: LoanDetailsModel[] | any;
  installmentDetails: LoanInstallmentModel | any;
  genericValue: any = { FREQUENCY: [], FORMAT: [] };

  constructor(
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
    private genericValueService: GenericValueService,
    private serviceCallHandler: ServiceCallHandler,
    private router: Router,
    private loanService: LoanService,
  ) {}

  ngOnInit(): void {
    this.loanDetails = this.sessionStorageService.getLoanInfo();
    this.buildeStatementForm();
    this.fetchGenericValues();
  }

  buildeStatementForm() {
    this.estatementForm = this.fb.group({
      accountNumber: [''],
      loanType: [''],
      email: [''],
      frequency: [''],
      format: [''],
    });
    this.estatementForm
      ?.get('accountNumber')
      ?.setValue(this.loanDetails?.[0]?.cbsAccountNumber);
    this.fetchLoanInstallment();
  }

  /**
   * fetch generic values
   */
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k]),
          );
        }
      });
  }

  //fetch installment details
  fetchLoanInstallment() {
    this.loanService
      .fetchLoanInstallment(this.estatementForm?.value?.accountNumber)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel> | any) => {
        if (res?.statusCode == 200 && res?.data) {
          this.installmentDetails = res?.data;
          this.estatementForm.get('email')?.setValue(res?.data?.email);
          this.estatementForm.get('loanType')?.setValue(res?.data?.loanType);
        }
      });
  }

  saveEStatement() {
    const payload = { ...this.estatementForm.value };

    const eArr = [
      {
        eventType: 'topUp',
        operationType: 'Loan',
        status: 'details',
        masterId: 'benificiaryMasterId',
        statusHeader: 'Confirm Details',
        statusNews: 'Top Up Loan Request',
        summary: [
          {
            header: 'Loan Details',
            details: [
              { Name: this.installmentDetails?.customerName },
              {
                'Loan Account Number':
                  this.estatementForm?.get('accountNumber')?.value,
              },
              { Type: this.installmentDetails?.loanType },
              { 'Loan Amount': this.installmentDetails?.loanAmount },
              {
                Email: this.installmentDetails?.email,
              },
              {
                Frequency: this.estatementForm?.value?.frequency,
              },
              {
                Format: this.estatementForm?.value?.format,
              },
            ],
          },
        ],
      },
    ];
    this.serviceCallHandler.put('serviceHandler', payload, eArr, (payload) =>
      this.loanService.saveEStatement(payload),
    );
    this.router.navigate(['/user/loan/loan-service/payment-summary']);
  }
}
