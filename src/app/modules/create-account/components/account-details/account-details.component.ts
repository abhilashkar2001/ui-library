// import { getCurrencySymbol } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { LocaleData, selectUser, User } from '@onerumango/utils';
// import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
// import moment from 'moment';
import { catchError, map, Observable, of, Subscription, tap } from 'rxjs';
// import { AccountSelectionComponent } from '../account-selection/account-selection.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit, OnDestroy, OnChanges {
  accountDetailsForm!: FormGroup;
  createAccountDetailsSummaryArr: any[] = [];
  genericValue: any | undefined;
  todaysDate = new Date();
  staticData = {
    HOLDERTYPE: [],
  };
  holderTypeArr = [
    { label: 'Individual', value: 'individual' },
    { label: 'Minor', value: 'minor' },
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
  selectedAccountType: string = '';
  data: any;
  basisClass!: string | null;
  customerId: any;

  constructor(
    private fb: FormBuilder,
    // private genericValueService: GenericValueService,
    private store: Store,
    private loanService: LoanService,
    private accountService: OpenAccountService,
    private router: Router,
    // private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.basisClass = sessionStorageService.getItem('basisClass');
    this.currentDate?.setDate(this.todaysDate.getDate() + 1);
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
    this.data = this.activatedRoute.snapshot['queryParams']['type'];
    // this.loadLocaleData();
  }

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.initializeCreateAccountDetailsArray();
    if (this.originationId) {
      this.fetchLoanDetails();
    }
    this.buildLoanDetailsForm('');

    const validValues = this.holderTypeArr.map((item) => item.value);
    const accountType = localStorage.getItem('account-type') || '';
    if (validValues.includes(accountType)) {
      this.accountDetailsForm?.get('holderType')?.setValue(accountType);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEdit']) {
      console.log('Edit mode ON');
    }
  }

  holderTypeChange() {
    localStorage.setItem(
      'account-type',
      this.accountDetailsForm?.get('holderType')?.value,
    );
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  initializeCreateAccountDetailsArray(_data?: any) {
    this.createAccountDetailsSummaryArr = [];
  }

  openAccountType() {
    this.router.navigate(['/account']);
  }

  // fetch loan details function
  fetchLoanDetails() {
    if (this.originationId)
      this.loanService.getLoanDetails(this.originationId).subscribe((resp) => {
        if (resp.statusCode === 200) {
          this.accountDetailsForm?.patchValue(resp?.data);
          this.initializeCreateAccountDetailsArray(resp?.data);
        }
      });
  }

  // fetchBasicDetails() {
  //   this.accountService
  //     .fetchBasicDetails(this.originationId)
  //     .subscribe((resp: any) => {
  //       this.createAccountDetailsSummaryArr = resp.data;
  //     });
  // }

  get holderType() {
    return this.accountDetailsForm?.get('holderType')?.value;
  }

  buildLoanDetailsForm(item: any) {
    this.accountDetailsForm = this.fb.group({
      accountType: [item.accountType || null],
      accountDescription: [item.accountDescription || null],
      accountBranch: [item.accountBranch || null],
      businessProductName: [item.businessProductName || null],
      productDescription: [item.productDescription || null],
      applicationDate: [item.applicationDate || null],
      userRefNumber: [item.userRefNumber || null],
      cbsRefNumber: [item.cbsRefNumber || null],
      swiftCode: [item.swiftCode || null],
      agentCode: [item.agentCode || null],
      rmId: [item.rmId || null],
      initialFunding: [item.initialFunding ?? false],
      overdraftRequested: [item.overdraftRequested ?? false],
      holderType: [item.holderType || null],
      noOfApplicant: [item.noOfApplicant || null],
      customerCategory: [item.customerCategory || null],
      customerAccountInitialFunding: this.fb.group({
        amount: [item.customerAccountInitialFunding?.amount || null],
        fundByAccount: [
          item.customerAccountInitialFunding?.fundByAccount || null,
        ],
        branchCode: [item.customerAccountInitialFunding?.branchCode || null],
        chequeNumber: [
          item.customerAccountInitialFunding?.chequeNumber || null,
        ],
        tellertransactionRefNo: [
          item.customerAccountInitialFunding?.tellertransactionRefNo || null,
        ],
      }),

      originationDetail: this.fb.group({
        originationId: [item.originationDetail?.originationId || null],
        applicationDate: [item.originationDetail?.applicationDate || null],
        icustRefNo: [item.originationDetail?.icustRefNo || null],
        source: [item.originationDetail?.source || null],
        status: [item.originationDetail?.status || null],
        subStatus: [item.originationDetail?.subStatus || null],
        branch: this.fb.group({
          id: [item.originationDetail?.branch?.id || null],
        }),
        accountCurrency: this.fb.group({
          id: [item.originationDetail?.accountCurrency?.id || null],
          currencyCode: [
            item.originationDetail?.accountCurrency?.currencyCode || null,
          ],
        }),
        productDetails: this.fb.group({
          id: [item.originationDetail?.productDetails?.id || null],
        }),
      }),
    });

    // Holder type change logic
    this.accountDetailsForm
      .get('holderType')
      ?.valueChanges.subscribe((holderType: string) => {
        if (holderType?.toLowerCase() === 'joint') {
          this.accountDetailsForm.get('noOfApplicant')?.setValue(2);
        } else {
          this.accountDetailsForm.get('noOfApplicant')?.reset();
        }
      });
  }
  // This function is used to call the EMI calculation API when the loan data changes
  callEmiCalculationAPI(payload: any) {
    this.loanService.getEmiCalculation(payload).subscribe((res: any) => {
      if (res?.statusCode === 200) {
        this.accountDetailsForm.get('loanDetails')?.patchValue({
          emiAmount: res?.data?.monthlyPayment,
          emiInterestPayable: res?.data?.principal,
          totalInterestAmount: res?.data?.totalInterest,
          totalPayableAmount: res.data?.totalRepaymentAmount,
        });
      }
    });
  }

  submitForm() {
    console.log(this.accountDetailsForm, 'jhgfds');

    const payload: any = {
      ...this.accountDetailsForm?.value,
    };
    this.createAccountDetailsSummaryArr.forEach((item: any) => {
      payload[item?.formControlName] = item?.value;
    });
    payload.originationDetail.originationId = this.originationId;
    // delete payload.loanDetails.totalPrincipalAmount;
    // payload.screenCode = 444;
    console.log(payload);

    this.accountService
      .saveAccountDetails(payload)
      .pipe(
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
      )
      .subscribe((resp: any) => {
        console.log('RESP: ', resp);
      });
  }
  ngOnDestroy() {
    this.valueChangesSubscription?.unsubscribe();
  }
}
