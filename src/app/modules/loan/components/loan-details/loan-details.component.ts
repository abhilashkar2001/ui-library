import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  LocaleData,
  selectLocaleData,
  selectUser,
  User,
} from '@onerumango/utils';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { Observable, Subscription } from 'rxjs';

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
    { label: 'Self', value: 'self' },
    { label: 'Joint', value: 'joint' },
  ];
  profileInfo: any;
  userProfile$!: Observable<User | null>;
  currentDate: Date | undefined;
  subscriptions: Subscription[] = [];
  otherUserInfo: LocaleData | undefined;
  currencySymboll = '';

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private store: Store,
    private loanService: LoanService,
  ) {
    this.currentDate?.setDate(this.todaysDate.getDate() + 1);
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
    this.loadLocaleData();
  }

  ngOnInit() {
    this.fetchGenericValues();
    this.initializeLoanDetailsArray();
    this.buildLoanDetailsForm();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  loadLocaleData(): void {
    const localeDataSub = this.store
      .select(selectLocaleData)
      .subscribe((localeData) => {
        if (localeData) {
          this.otherUserInfo = localeData;
          this.currencySymboll = getCurrencySymbol(
            this.otherUserInfo.currency,
            'wide',
          );
        }
      });
    this.subscriptions.push(localeDataSub);
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
        originationId: [''],
      }),
      loanDetails: this.fb.group({
        loanId: [''],
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

      repaymentModel: this.fb.group({
        id: null,
        firstRepaymentDate: [''],
        repaymentFrequencyId: [''],
      }),
      screenCode: [''],
    });
  }

  get loanDetails() {
    return this.loanDetailsForm?.get('loanDetails') as FormGroup;
  }

  get repaymentDetails() {
    return this.loanDetailsForm?.get('repaymentModel') as FormGroup;
  }

  saveLoanDetails() {
    const payload = {
      ...this.loanDetailsForm?.value,
    };
    payload.originationModel.originationId = 554;
    payload.screenCode = 444;

    console.log(payload, 'payload');

    this.loanService.saveLoanDetails(payload).subscribe((resp) => {
      console.log(resp);
    });
  }
}
