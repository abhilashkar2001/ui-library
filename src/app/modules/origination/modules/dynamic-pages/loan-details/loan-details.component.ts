import { getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Data } from '@angular/router';
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
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss'],
})
export class LoanDetailsComponent implements OnInit {
  @Output() CustomSubmit = new EventEmitter<Data>();
  @Output() backEvent = new EventEmitter<Data>();
  loanDetailsForm!: FormGroup;
  todaysDate = new Date();
  currentDate: Date | undefined;
  staticData = {
    DISBURSEMENTTYPE: [],
    REPAYMENTFREQUENCY: [],
    ACCOUNTTYPE: [],
  };
  accountValue = [
    { label: 'Internal', value: true },
    { label: 'External', value: false },
  ];
  genericValue: any | undefined;
  profileInfo: any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  otherUserInfo: LocaleData | undefined;
  currencySymboll = '';
  originationId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private matIconRegiostry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private store: Store,
    private sessionStorageService: SessionStorageService,
    private loanApi: LoanService,
  ) {
    this.currentDate?.setDate(this.todaysDate.getDate() + 1);
    this.matIconRegiostry.addSvgIcon(
      `calendar`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/calendar.svg',
      ),
    );
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
    this.loadLocaleData();
  }

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.fetchGenericValues();
    setTimeout(() => {
      this.buildDetailsForm();
      this.getLoanDetails();
    }, 2000);
  }

  buildDetailsForm(data?: any) {
    this.loanDetailsForm = this.fb.group({
      loanDetails: this.fb.group({
        loanAmount: [
          data?.loanDetails?.loanAmount ?? data?.principalAmount ?? '',
          Validators.required,
        ],
        interestRate: [
          data?.loanDetails?.interestRate ?? data?.interestRate ?? '',
          Validators.required,
        ],
        loanTenureYear: [data?.loanDetails?.loanTenureYear ?? 0],
        loanTenureMonth: [data?.loanDetails?.loanTenureMonth ?? 0],
        loanTenureDay: [data?.loanDetails?.loanTenureDay ?? 0],
        emiAmount: [data?.loanDetails?.emiAmount ?? '', Validators.required],
        emiInterestPayable: [data?.loanDetails?.interestPayable ?? ''],
        totalInterestAmount: [data?.loanDetails?.interestPayable ?? ''],
        totalPayableAmount: [data?.loanDetails?.totalPayableAmount ?? ''],
      }),

      loanDisbursementModel: this.fb.group({
        disbursementModeId: [
          data?.loanDisbursementModel?.disbursementModeId?.data
            ?.disbursementModeId ?? '',
          Validators.required,
        ],
        disbursementMode: [
          data?.loanDisbursementModel?.disbursementModeValue?.data
            ?.disbursementMode ?? 'Cash',
        ],
        internal: [
          data?.loanDisbursementModel?.internal?.data?.internal ?? false,
        ],
        loanAmount: [
          this.loanDetailsForm?.value?.loanAmount ?? data?.principalAmount,
        ],
        firstDisbursementDate: [
          data?.loanDisbursementModel?.firstDisbursementDate ??
            this.currentDate,
        ],
        chequeNumber: [
          data?.loanDisbursementModel?.chequeNumber ?? data?.chequeNumber ?? '',
        ],
        requiredMultipleDisbursement: true,
        scheduleFrequencyYear: 0,
        scheduleFrequencyMonth: 1,
        scheduleFrequencyDay: 0,
        disbursementAccount: this.fb.group({
          accountNo: [
            data?.loanDisbursementModel?.disbursementAccount?.accountNo ?? '',
          ],
          accountType: [
            data?.loanDisbursementModel?.disbursementAccount?.accountType ?? '',
          ],
          customerName: [
            data?.loanDisbursementModel?.disbursementAccount?.customerName ??
              '',
          ],
          bankCode: [
            data?.loanDisbursementModel?.disbursementAccount?.bankCode ?? '',
          ],
          bankName: [
            data?.loanDisbursementModel?.disbursementAccount?.bankName ?? '',
          ],
          branchName: [
            data?.loanDisbursementModel?.disbursementAccount?.branchName ?? '',
          ],
        }),
      }),
      originationModel: this.fb.group({
        applicationDate: [moment(this.todaysDate).format('YYYY-MM-DD')],
        branchId: [this.profileInfo?.branchId],
        source: 'Website',
        currencyCode: [this.profileInfo?.currencyCode],
        currencyId: [this.profileInfo?.currencyId],
        originationProductId: [
          this.sessionStorageService.getLoanBasisDetails()?.basisId,
        ],
      }),
      repaymentModel: this.fb.group({
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
        repaymentFrequencyId: [
          data?.repaymentModel?.repaymentFrequencyId ??
            data?.repaymentFrequencyId ??
            '',
          Validators.required,
        ],
      }),
      screenCode: [''],
    });

    const disbursementAccount = this.loanDisbursementModel.get(
      'disbursementAccount',
    ) as FormGroup;
    const chequeNumberControl = this.loanDisbursementModel.get('chequeNumber');

    if (!disbursementAccount) return;

    const requiredFieldsForAccount = [
      'accountNo',
      'accountType',
      'bankName',
      'branchName',
      'customerName',
      'bankCode',
    ];
    const customerNameField = 'customerName';
    const accountNoField = 'accountNo';

    const updateValidators = (control: any, required: boolean) => {
      if (!control) return;
      control.setValidators(required ? Validators.required : null);
      control.updateValueAndValidity();
    };

    this.loanDisbursementModel
      .get('disbursementMode')
      ?.valueChanges.subscribe((mode: string) => {
        if (mode === 'Account') {
          requiredFieldsForAccount.forEach((field) =>
            updateValidators(disbursementAccount.get(field), true),
          );
          // updateValidators(disbursementAccount.get(customerNameField), false);
          updateValidators(chequeNumberControl, false);
        } else if (mode === 'Cheque') {
          requiredFieldsForAccount.forEach((field) =>
            updateValidators(disbursementAccount.get(field), false),
          );
          updateValidators(disbursementAccount.get('bankName'), true);
          updateValidators(disbursementAccount.get(customerNameField), true);
          updateValidators(disbursementAccount.get(accountNoField), true);
          updateValidators(chequeNumberControl, true);
        } else {
          [...requiredFieldsForAccount, customerNameField].forEach((field) =>
            updateValidators(disbursementAccount.get(field), false),
          );
          updateValidators(chequeNumberControl, false);
        }
      });

    this.setupLoanCalculationListener();
  }

  // When the loan details change, this function is called to set up the listener for loan calculation
  setupLoanCalculationListener() {
    const loanDetailsGroup = this.loanDetailsForm.get('loanDetails');
    const repaymentModelGroup = this.loanDetailsForm.get('repaymentModel');
    if (!loanDetailsGroup || !repaymentModelGroup) return;
    loanDetailsGroup.valueChanges
      .pipe(
        debounceTime(300),
        map(
          ({
            loanAmount,
            interestRate,
            loanTenureYear,
            loanTenureMonth,
            loanTenureDay,
          }) => ({
            principleAmount: loanAmount,
            interestRate,
            numberOfMonths:
              (loanTenureYear ?? 0) * 12 +
              (loanTenureMonth ?? 0) +
              Math.floor((loanTenureDay ?? 0) / 30),
          }),
        ),
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
          repaymentModelGroup.get('firstRepaymentDate')?.value;
        this.callEmiCalculationAPI({
          principleAmount,
          interestRate,
          numberOfMonths,
          firstRepaymentDate,
        });
      });
  }

  // This function is used to call the EMI calculation API when the loan data changes
  callEmiCalculationAPI(payload: any) {
    this.loanApi.getEmiCalculation(payload).subscribe((res: any) => {
      if (res?.statusCode === 200) {
        this.loanDetailsForm.get('loanDetails')?.patchValue({
          emiAmount: res?.data?.monthlyPayment,
          emiInterestPayable: res?.data?.principal,
          totalInterestAmount: res?.data?.totalInterest,
          totalPayableAmount: res.data?.totalRepaymentAmount,
        });
      }
    });

    console.log(this.loanDetailsForm, 'formgrou');
  }

  get loanDetails() {
    return this.loanDetailsForm?.get('loanDetails') as FormGroup;
  }

  get loanDisbursementModel() {
    return this.loanDetailsForm?.get('loanDisbursementModel') as FormGroup;
  }

  get loanDisbursementAccount() {
    return this.loanDisbursementModel?.get('disbursementAccount') as FormGroup;
  }

  get repaymentModel() {
    return this.loanDetailsForm?.get('repaymentModel') as FormGroup;
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

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.genericValue = resp?.data;
        }
      });
  }

  setDisbursement(event: number) {
    console.log(event);
    if (event) {
      const disbursement = this.genericValue?.DISBURSEMENTTYPE?.find(
        (value: { id: number; values: string }) => value?.id === event,
      )?.values;
      this.loanDisbursementModel
        ?.get('disbursementMode')
        ?.setValue(disbursement);
    }
  }

  getLoanDetails() {
    if (this.originationId)
      this.loanApi.getLoanDetails(this.originationId).subscribe((resp) => {
        if (resp.statusCode === 200) {
          this.loanDetailsForm?.patchValue(resp?.data);
        }
      });
  }

  onConfirm() {
    if (this.loanDetailsForm?.invalid) {
      this.loanDetailsForm?.markAllAsTouched();
      return;
    }
    const payload = {
      ...this.loanDetailsForm?.value,
    };
    payload.originationModel.originationId = this.originationId;
    payload.loanDisbursementModel.loanAmount = payload.loanDetails.loanAmount;
    payload.originationModel.currencyId = this.profileInfo?.currencyId;
    payload.loanDisbursementModel.chequeNumber = Number(
      payload.loanDisbursementModel.chequeNumber,
    );
    payload.screenCode = this.sessionStorageService.getCurrentScreenCode();
    payload.loanDisbursementModel.firstDisbursementDate = moment(
      this.currentDate,
    ).format('MM-DD-YYYY');
    delete payload?.loanDisbursementModel?.disbursementMode;
    this.loanApi.saveLoanDetails(payload).subscribe((resp) => {
      if (resp.statusCode === 200) {
        this.sessionStorageService.setEmiData(resp.data?.loanDetails);
        this.sessionStorageService.setLoanAmount(
          payload.loanDetails.loanAmount,
        );
        this.CustomSubmit.emit({ isNext: true });
      }
    });
  }

  onBack() {
    this.backEvent.emit();
  }
}
