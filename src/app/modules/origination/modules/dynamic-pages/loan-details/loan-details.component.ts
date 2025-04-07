import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
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
  loanDetailsForm: FormGroup | undefined;
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

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private matIconRegiostry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private store: Store,
    private sessionStorageService: SessionStorageService,
    private loanApi: LoanService,
  ) {
    this.currentDate?.setDate(new Date().getDate() + 1);

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
    console.log(this.profileInfo);
    this.fetchGenericValues();
    const id = this.sessionStorageService.getLoanDisburseId();
    if (id) this.getLoanById(id);
    this.buildDetailsForm();
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
        loanTenureYear: [data?.loanDetails?.loanTenureYear ?? ''],
        loanTenureMonth: [data?.loanDetails?.loanTenureMonth ?? ''],
        loanTenureDays: [data?.loanDetails?.loanTenureDays ?? ''],
        emiAmount: [
          data?.loanDetails?.emiAmount ?? data?.emiAmount ?? '',
          Validators.required,
        ],
      }),
      interestPayable: [data?.interestPayable ?? ''],
      totalInterestAmount: [data?.totalInterestAmount ?? ''],
      totalPayableAmount: [data?.totalPayableAmount ?? ''],
      loanDisbursementModel: this.fb.group({
        disbursementModeId: [data?.disbursementModeId ?? ''],
        disbursementMode: [data?.disbursementMode ?? 'Cash'],
        internal: [data?.internal ?? ''],
        loanAmount: [
          this.loanDetailsForm?.value?.loanAmount ?? data?.principalAmount,
        ],
        firstDisbursementDate: [this.currentDate],
        chequeNumber: [data?.chequeNumber ?? ''],
        disbursementAccount: this.fb.group({
          accountNo: [data?.accountNo ?? ''],
          accountType: [data?.accountType ?? ''],
          customerName: [data?.customerName ?? ''],
          bankCode: [data?.bankCode ?? ''],
          bankName: [data?.bankName ?? ''],
          branchName: [data?.branchName ?? ''],
        }),
      }),
      originationModel: this.fb.group({
        applicationDate: [this.todaysDate],
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
        repaymentFrequencyId: [data?.repaymentFrequencyId ?? ''],
      }),
      screenCode: this.sessionStorageService.getCurrentScreenCode(),
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
      console.log(this.genericValue?.DISBURSEMENTTYPE);
      const disbursement = this.genericValue?.DISBURSEMENTTYPE?.find(
        (value: { id: number; values: string }) => value?.id === event,
      )?.values;
      console.log(disbursement);
      this.loanDisbursementModel
        ?.get('disbursementMode')
        ?.setValue(disbursement);
    }
  }

  /**
   * Api call to fetch webDisbursement by id.
   * @param id webdisbursementId
   */
  getLoanById(id: number) {
    this.loanApi.getLoanById(id).subscribe({
      next: (resp) => {
        if (resp.statusCode === 200) {
          this.buildDetailsForm({
            ...resp?.data,
            loanDetails: {
              loanTenureDays: this.sessionStorageService.getTenureDays() || 0,
              loanTenureYear: this.sessionStorageService.getTenureYear() || 0,
              loanTenureMonth: this.sessionStorageService.getTenureMonth() || 0,
            },
          });
        } else {
          this.buildDetailsForm();
        }
      },
    });
  }

  onConfirm() {
    console.log('loanDetailsForm', this.loanDetailsForm?.value);
    const payload = {
      ...this.loanDetailsForm?.value,
    };
    delete payload?.interestPayable;
    delete payload?.totalInterestAmount;
    delete payload?.totalPayableAmount;
    this.loanApi.saveLoanDetails(payload).subscribe((resp) => {
      if (resp.statusCode === 200) {
        console.log(resp?.data);
      }
    });
  }

  onBack() {
    console.log('first');
  }
}
