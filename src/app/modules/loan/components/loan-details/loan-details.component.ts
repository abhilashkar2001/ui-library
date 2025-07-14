import { getCurrencySymbol } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  LocaleData,
  selectLocaleData,
  selectUser,
  User,
} from '@onerumango/utils';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import moment from 'moment';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  Subscription,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
})
export class LoanDetailsComponent implements OnInit, OnDestroy, OnChanges {
  loanDetailsForm!: FormGroup;
  loanDetailsSummaryArr: any[] = [];
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
  currencySymbol = '';
  originationId: number | undefined;
  valueChangesSubscription: Subscription | any;
  tenureErrorMessage: string | undefined;
  min: any;
  productDetails: any;
  max: any;
  @Input() isEdit = false;
  @Input() screenCode = '';
  monthlyRepaymentId: any;

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private store: Store,
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
  ) {
    this.currentDate?.setDate(this.todaysDate.getDate() + 1);
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
    this.loadLocaleData();
  }

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.fetchGenericValues();
    this.initializeLoanDetailsArray();
    if (this.originationId) {
      this.fetchLoanDetails();
    }
    this.buildLoanDetailsForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEdit']) {
      console.log('Edit mode ON');
    }
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
          this.currencySymbol = getCurrencySymbol(
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
        value: data?.loanDetails?.loanAmount,
        formControlName: 'loanAmount',
        currency: true,
      },
      {
        header: 'Tenure',
        value: `${data?.loanDetails?.loanTenureYear || 0}Year ${data?.loanDetails?.loanTenureMonth || 0}Month ${data?.loanDetails?.loanTenureDay || 0}Days`,
        formControlName: 'loanTenureYear',
      },
      {
        header: 'Interest Rate %',
        value: data?.loanDetails?.interestRate,
        formControlName: 'interestRate',
        currency: true,
      },
      {
        header: 'EMI Amount',
        value: data?.loanDetails?.emiAmount,
        formControlName: 'emiAmount',
        currency: true,
      },
      {
        header: 'Interest Payable',
        value: data?.loanDetails?.totalInterestAmount,
        formControlName: 'interestPayable',
        currency: true,
      },
      {
        header: 'Total Principal Amount',
        value: data?.loanDetails?.totalPrincipalAmount,
        formControlName: 'totalPrincipalAmount',
        currency: true,
      },
      {
        header: 'Total Payable Amount',
        value: data?.loanDetails?.totalPayableAmount,
        formControlName: 'totalPayableAmount',
        currency: true,
      },
      {
        header: 'Repayment Frequency*',
        value: data?.repaymentModel?.repaymentFrequencyValue ?? 'Monthly',
        formControlName: 'repaymentFrequencyId',
      },
      {
        header: 'EMI Start Date*',
        value: this.repaymentDetails?.value?.firstRepaymentDate ?? 'null',
        formControlName: 'firstRepaymentDate',
      },
      {
        header: 'Holder Type*',
        value: data?.loanDetails?.holderType ?? 'Self',
        formControlName: 'holderType',
      },
    ];
  }

  // fetch loan details function
  fetchLoanDetails() {
    if (this.originationId)
      this.loanService.getLoanDetails(this.originationId).subscribe((resp) => {
        if (resp.statusCode === 200) {
          this.loanDetailsForm?.patchValue(resp?.data);
          this.initializeLoanDetailsArray(resp?.data);
        }
      });
  }

  // fetch Generic Method
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genericValue = resp?.data;
          const monthly = this.genericValue['REPAYMENTFREQUENCY'].find(
            (item: any) => item.values?.toLowerCase() === 'monthly',
          );
          this.monthlyRepaymentId = monthly?.id ?? null;
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
        totalInterestAmount: [''],
        totalPrincipalAmount: [''],
        totalPayableAmount: [''],
        holderType: ['self'],
      }),

      repaymentModel: this.fb.group({
        id: null,
        firstRepaymentDate: [
          moment(
            new Date(
              this.todaysDate.getFullYear(),
              this.todaysDate.getMonth() + 1,
              this.todaysDate.getDate(),
            ),
          ).format('MM-DD-YYYY'),
          Validators.required,
        ],
        repaymentFrequencyId: [''],
      }),
      screenCode: [''],
    });

    const loanDetailsGroup = this.loanDetailsForm.get(
      'loanDetails',
    ) as FormGroup;

    const loanAmountCtrl = loanDetailsGroup.get('loanAmount');
    const interestRateCtrl = loanDetailsGroup.get('interestRate');
    const yearCtrl = loanDetailsGroup.get('loanTenureYear');
    const monthCtrl = loanDetailsGroup.get('loanTenureMonth');
    const dayCtrl = loanDetailsGroup.get('loanTenureDay');

    if (
      loanAmountCtrl &&
      interestRateCtrl &&
      yearCtrl &&
      monthCtrl &&
      dayCtrl
    ) {
      combineLatest([
        loanAmountCtrl.valueChanges,
        interestRateCtrl.valueChanges,
        yearCtrl.valueChanges,
        monthCtrl.valueChanges,
        dayCtrl.valueChanges,
      ])
        .pipe(
          debounceTime(300),
          map(([loanAmount, interestRate, year, month, day]) => ({
            principleAmount: loanAmount,
            interestRate: interestRate,
            numberOfMonths:
              (+year || 0) * 12 +
              (+month || 0) +
              ((+day || 0) < 30 ? 0 : Math.floor(+day / 30)),
          })),
          filter(
            ({ principleAmount, interestRate, numberOfMonths }) =>
              !!principleAmount && !!interestRate && numberOfMonths > 0,
          ),
          distinctUntilChanged(
            (prev, curr) =>
              prev.principleAmount === curr.principleAmount &&
              prev.interestRate === curr.interestRate &&
              prev.numberOfMonths === curr.numberOfMonths,
          ),
        )
        .subscribe(({ principleAmount, interestRate, numberOfMonths }) => {
          const firstRepaymentDate =
            this.repaymentDetails.get('firstRepaymentDate')?.value;
          this.callEmiCalculationAPI({
            principleAmount,
            interestRate,
            numberOfMonths,
            firstRepaymentDate,
          });
        });
    }
  }

  // This function is used to call the EMI calculation API when the loan data changes
  callEmiCalculationAPI(payload: any) {
    this.loanService.getEmiCalculation(payload).subscribe((res: any) => {
      if (res?.statusCode === 200) {
        this.loanDetailsForm.get('loanDetails')?.patchValue({
          emiAmount: res?.data?.monthlyPayment,
          emiInterestPayable: res?.data?.principal,
          totalInterestAmount: res?.data?.totalInterest,
          totalPayableAmount: res.data?.totalRepaymentAmount,
        });
      }
    });
  }

  get loanDetails() {
    return this.loanDetailsForm?.get('loanDetails') as FormGroup;
  }

  get repaymentDetails() {
    return this.loanDetailsForm?.get('repaymentModel') as FormGroup;
  }

  handleSubmit() {
    const payload = {
      ...this.loanDetailsForm?.value,
    };

    if (
      payload.repaymentModel?.repaymentFrequencyId == '' &&
      payload.loanDetails.holderType == null
    ) {
      payload.repaymentModel.repaymentFrequencyId = this.monthlyRepaymentId;
      payload.loanDetails.holderType = 'self';
    }
    payload.originationModel.originationId = this.originationId;
    delete payload.loanDetails.totalPrincipalAmount;
    payload.screenCode = 444;

    return this.loanService.saveLoanDetails(payload).pipe(
      tap((res) => {
        console.log(res);
      }),
      map((res) =>
        res?.statusCode == 200 || res?.statusCode == 201
          ? ('success' as const)
          : ('failure' as const),
      ),
      catchError((_err) => {
        console.error(_err);
        return of('failure' as const);
      }),
    );
  }

  submitForm() {
    return this.handleSubmit().toPromise();
  }
  ngOnDestroy() {
    this.valueChangesSubscription?.unsubscribe();
  }
}
