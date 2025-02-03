import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';
import { LoanTopUpStore } from '../topup-loan/topup-loan.store';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { LoanService } from 'app/shared/services/net-loan-service/loan.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoanDetailsModel } from 'app/shared/models/loan-details.model';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { ServiceCallHandler } from 'app/shared/service-call.handler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modify-tenure',
  templateUrl: './modify-tenure.component.html',
  styleUrls: ['./modify-tenure.component.scss'],
})
export class ModifyTenureComponent implements OnInit {
  modifyTenureForm!: FormGroup;
  minTenure = 7;
  maxTenureInYears = 10;
  maxTenure = 3650;
  chartSectionDetails = LoanTopUpStore.ChartDetails;
  accountDetails = LoanTopUpStore.loanAccountDetails;
  installmentDetails: LoanInstallmentModel | any;
  genericValue: any = { REASON: [] };
  calculatedData: any;
  loanDetails: LoanDetailsModel[] | any;
  chartData: any;
  corpCustId: number | any;
  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
  ) {}

  ngOnInit(): void {
    this.corpCustId = this.sessionStorageService.getCustomerInfo()?.customerId;
    this.loanDetails = this.sessionStorageService.getLoanInfo();
    this.buildModifyTenure();
    this.fetchGenericValues();
  }

  //building the form
  buildModifyTenure() {
    this.modifyTenureForm = this.fb.group({
      debitAccount: [''],
      debitCurrency: [''],
      tenureYear: [''],
      tenureMonth: [''],
      tenureDay: [''],
      reason: [''],
      remarks: [''],
      tenure: [''],
      acceptTermsConditions: [''],
      transferType: 'Modify Tenure',
      source: 'I',
      corpCustomerId: this.corpCustId,
    });
    this.modifyTenureForm
      .get('debitAccount')
      ?.setValue?.(this.loanDetails[0]?.cbsAccountNumber);
    this.modifyTenureForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        if (this.modifyTenureForm.valid) this.calculateTenure();
      });
    this.fetchLoanInstallment();
  }

  //fetch generic values
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
      .fetchLoanInstallment(this.modifyTenureForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel> | any) => {
        if (res?.statusCode == 200 && res?.data) {
          this.installmentDetails = res?.data;
        }
      });
  }

  //when the input values changes, slider value changes
  onTenureChange() {
    const year = this.modifyTenureForm.value.tenureYear;
    const month = this.modifyTenureForm.value.tenureMonth;
    const day = this.modifyTenureForm.value.tenureDay;
    const totalDays = year * 365 + month * 30 + day * 1;
    this.modifyTenureForm.get('tenure')?.setValue(totalDays);
  }

  //on the slider change, the input values should change
  onSliderChangeForTenure(e: any) {
    const maxTenure = e.value;
    const years = Math.floor(maxTenure / 365);
    let remainingDays = maxTenure % 365;
    const months = Math.floor(remainingDays / 30);
    remainingDays = remainingDays % 30;
    this.modifyTenureForm.get('tenureYear')?.setValue(years);
    this.modifyTenureForm.get('tenureMonth')?.setValue(months);
    this.modifyTenureForm.get('tenureDay')?.setValue(remainingDays);
    this.calculateTenure();
  }

  calculateTenure() {
    const numberOfMonths =
      this.modifyTenureForm.value.tenureYear * 12 +
      this.modifyTenureForm.value.tenureMonth;
    const payload = {
      firstRepaymentDate: new Date(),
      interestRate: this.installmentDetails?.interestRate || 10,
      numberOfMonths: numberOfMonths,
      principleAmount: this.installmentDetails?.loanAmount,
    };

    this.loanService.calculateEMI(payload).subscribe((res: any) => {
      this.calculatedData = {
        ...res?.data,
        maturityAmount: res?.data?.monthlyPayment,
        depositAmount: this.installmentDetails?.emiAmount,
        currentMaturityDate: this.installmentDetails?.maturityDate,
        currentInterest: this.installmentDetails?.totalInterest,
      };
    });
  }

  //save function to save the details
  saveModifyTenure() {
    const payload: any = { ...this.modifyTenureForm.value };
    const modifyTenureArr = [
      {
        eventType: 'modifyTenure',
        operationType: 'Loan',
        status: 'confirm',
        masterId: 'benificiaryMasterId',
        statusHeader: 'Comfirm Details',
        statusNews: 'Modify Tenure Successfully!',
        summary: [
          {
            header: 'Loan Details',
            details: [
              { Name: this.installmentDetails?.customerName },
              {
                'Loan Account Number':
                  this.modifyTenureForm?.get('debitAccount')?.value,
              },
              { Type: this.installmentDetails?.loanType },
              { 'Loan Amount': this.installmentDetails?.loanAmount },
              {
                'Outstanding Principal':
                  this.installmentDetails?.outstandPrincpl,
              },
              {
                'Interest Rate': this.installmentDetails?.interestRate,
              },
              {
                Duration: this.installmentDetails?.duration,
              },
              { 'Maturity Date': this.installmentDetails?.maturityDate },
              {
                'Remaining Installments':
                  this.installmentDetails?.remainingInstall,
              },
              { Status: this.installmentDetails?.status },
            ],
          },
          {
            header: 'Modify Tenure ',
            details: [
              { Tenure: this.modifyTenureForm.value.tenureYear + 'Year' },
              { 'New Monthly Payment': '' },
              { 'New Interest Rate': '' },
              { Purpose: this.modifyTenureForm.value.remarks },
            ],
          },
        ],
      },
    ];
    this.serviceCallHandler.put(
      'serviceHandler',
      payload,
      modifyTenureArr,
      (payload) => this.loanService.saveService(payload),
    );
    this.router.navigate(['/user/loan/loan-service/payment-summary']);
  }
}
