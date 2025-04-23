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
import { Observable, Subscription } from 'rxjs';

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
    console.log(data);
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
          ).format('YYYY-MM-DD'),
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
    ];
    const customerNameField = 'customerName';
    const accountNoField = 'accountNo';

    const updateValidators = (control: any, required: boolean) => {
      if (!control) return;
      control.setValidators(required ? Validators.required : null);
      control.updateValueAndValidity();
      console.log(control, 'Control');
      console.log(required, 'Required');
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
          this.currencySymboll = this.otherUserInfo?.currency;
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
    payload.loanDisbursementModel.chequeNumber = Number(
      payload.loanDisbursementModel.chequeNumber,
    );
    payload.screenCode = this.sessionStorageService.getCurrentScreenCode();
    payload.loanDisbursementModel.firstDisbursementDate = moment(
      this.currentDate,
    ).format('YYYY-MM-DD');
    delete payload?.loanDisbursementModel?.disbursementMode;
    this.loanApi.saveLoanDetails(payload).subscribe((resp) => {
      if (resp.statusCode === 200) {
        this.sessionStorageService.setEmiData(resp.data?.loanDetails);
        this.CustomSubmit.emit({ isNext: true });
      }
    });
  }

  onBack() {
    this.backEvent.emit();
  }
}
