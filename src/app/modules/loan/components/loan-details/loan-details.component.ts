import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GenericValueService } from 'app/shared/services/generic-value.service';


@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
})
export class LoanDetailsComponent implements OnInit {
  loanDetailsForm!: FormGroup;
  loanDetailsSummaryArr: any[] = [];
  isEdit = true;
  genericValue: any | undefined;
  todaysDate = new Date();
  staticData = {
    REPAYMENTFREQUENCY: [],
  };
  holderTypeArr = [
    { label: 'Self', value: 'true' },
    { label: 'Others', value: 'false' },
  ];
  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
  ) {}

  ngOnInit() {
    this.fetchGenericValues();
    this.initializeLoanDetailsArray();
    this.buildLoanDetailsForm();
  }

  initializeLoanDetailsArray(data?: any) {
    this.loanDetailsSummaryArr = [
      {
        header: 'Loan Amount Requested (GHS)*',
        value: data?.loanAmount ?? '40000',
        formControlName: 'loanAmount',
        currency: true,
      },
      {
        header: 'Tenure',
        value: data?.loanTenureYear ?? '3',
        formControlName: 'loanTenureYear',
        currency: true,
      },
      {
        header: 'Interest Rate %',
        value: data?.interestRate ?? '10',
        formControlName: 'interestRate',
        currency: true,
      },
      {
        header: 'EMI Amount',
        value: data?.emiAmount ?? '4440',
        formControlName: 'emiAmount',
        currency: true,
      },
      {
        header: 'Interest Payable',
        value: data?.interestPayable ?? '92392',
        formControlName: 'interestPayable',
        currency: true,
      },
      {
        header: 'Total Principal Amount',
        value: data?.totalPrincipalAmount ? 'Yes' : 'No',
        formControlName: 'totalPrincipalAmount',
      },
      {
        header: 'Total Payable Amount',
        value: data?.totalPayableAmount ?? '323230',
        formControlName: 'totalPayableAmount',
        currency: true,
      },
      {
        header: 'Repayment Frequency*',
        value: data?.foreclosureAmount ?? 'Monthly',
        formControlName: 'foreclosureAmount',
        currency: true,
      },
      {
        header: 'EMI Start Date*',
        value: data?.foreclosureAmount ?? '05-18-2002',
        formControlName: 'foreclosureAmount',
        currency: true,
      },
    ];
  }

  // fetch Generic Method
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genericValue = resp?.data;
        }
      });
  }

  // Build Form
  buildLoanDetailsForm() {
    this.loanDetailsForm = this.fb.group({
      originationModel: this.fb.group({
        applicationDate: [''],
        branchId: [''],
        source: 'Website',
        currencyCode: [''],
        currencyId: [''],
        originationProductId: [''],
        firstRepaymentDate: [''],
      }),
      loanDetails: this.fb.group({
        loanAmount: [''],
        interestRate: [''],
        loanTenureYear: [''],
        loanTenureMonth: [''],
        loanTenureDay: [''],
        emiAmount: [''],
        emiInterestPayable: [''],
        totalInterestAmount: [''],
        totalPayableAmount: [''],
        holderType: [''],
      }),
      screenCode: [''],
    });
  }

  get loanDetails() {
    return this.loanDetailsForm?.get('loanDetails') as FormGroup;
  }
}
