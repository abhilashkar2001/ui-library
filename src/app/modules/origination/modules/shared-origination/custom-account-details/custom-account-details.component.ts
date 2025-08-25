import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocaleData, selectUser, User } from '@onerumango/utils';
import { AccountService } from 'app/shared/services/account.service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { catchError, map, Observable, of, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-custom-account-details',
  templateUrl: './custom-account-details.component.html',
  styleUrls: ['./custom-account-details.component.scss'],
})
export class CustomAccountDetailsComponent {
  @Input() accountDetailsForm!: FormGroup;
  @Output() accountSummaryEmit = new EventEmitter();

  createAccountDetailsSummaryArr: any;
  genericValue: any | undefined;
  todaysDate = new Date();
  staticData = {
    HOLDERTYPE: [],
  };
  currencyArr: any[] = [];
  accountBranchArr: any[] = [];
  customerCategoryArr: any[] = [];
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
  // productDetails: any;
  max: any;
  @Input() isEdit = true;
  @Input() screenCode = '';
  selectedAccountType: string = '';
  data: any;
  basisClass!: string | null;
  countryArr: any;

  constructor(
    // private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private store: Store,
    private loanService: LoanService,
    private accountService: AccountService,
    // private dialog: MatDialog,

    private openAccountService: OpenAccountService,
    private sessionStorageService: SessionStorageService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.basisClass = sessionStorageService.getItem('basisClass');
    this.currentDate?.setDate(this.todaysDate.getDate() + 1);
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
    this.data = this.activatedRoute.snapshot['queryParams']['type'];
    console.log(this.data);
    console.log(this.activatedRoute);

    // this.loadLocaleData();
  }

  ngOnInit() {
    this.originationId =
      this.sessionStorageService.getOriginationId() || '1152';
    this.fetchGenericValues();
    // this.initializeCreateAccountDetailsArray();
    if (this.originationId) {
      this.fetchLoanDetails();
    }
    this.fetchBasicDetails();
    this.fetchBranch();
    this.fetchCurrency();
    this.fetchCustomerCategory();
    // this.buildLoanDetailsForm('');

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
  getHolderTypeById(): string | null {
    const holderType = this.genericValue?.HOLDERTYPE.find(
      (type: any) =>
        type?.id == this.accountDetailsForm.get('holderTypeId')?.value,
    );
    return holderType ? holderType?.values : null;
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  handleCurrencyChange(curId: any) {
    const currencyCode = this.currencyArr.find(
      (item: any) => item?.id == curId,
    )?.currencyCode;
    this.accountCurrency.get('currencyCode')?.setValue(currencyCode);
  }

  // initializeCreateAccountDetailsArray(_data?: any) {
  //   this.createAccountDetailsSummaryArr = [];
  // }

  // fetch loan details function
  fetchLoanDetails() {
    if (this.originationId)
      this.accountService
        .getAccountDetails(this.originationId)
        .subscribe((resp) => {
          if (resp.statusCode === 200) {
            this.accountDetailsForm?.patchValue(resp?.data);
            // this.initializeCreateAccountDetailsArray(resp?.data);
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
          console.log(this.genericValue);
        }
      });
  }

  fetchBranch() {
    this.openAccountService.fetchBranch().subscribe((resp: any) => {
      this.accountBranchArr = Array.isArray(resp.data)
        ? resp.data
        : Object.values(resp.data);

      console.log(this.accountBranchArr);
    });
  }

  fetchCurrency() {
    this.openAccountService.fetchCurrency().subscribe((resp: any) => {
      this.currencyArr = resp?.data ?? [];
    });
  }
  fetchCustomerCategory() {
    this.openAccountService.fetchCustomerCategory().subscribe((resp: any) => {
      this.customerCategoryArr = resp?.data ?? [];
    });
  }
  fetchBasicDetails() {
    this.openAccountService
      .fetchProductDetails(this.originationId)
      .subscribe((resp: any) => {
        if (resp?.data?.length > 0) {
          this.createAccountDetailsSummaryArr = resp?.data[0] ?? [];
          this.accountSummaryEmit.emit(this.createAccountDetailsSummaryArr);
        }
      });
  }
  get holderType() {
    return this.accountDetailsForm?.get('holderType')?.value;
  }

  get customerAccountInitialFunding() {
    return this.accountDetailsForm.get(
      'customerAccountInitialFunding',
    ) as FormGroup;
  }

  get originationDetail() {
    return this.accountDetailsForm.get('originationDetail') as FormGroup;
  }

  get branch() {
    return this.originationDetail.get('branch') as FormGroup;
  }

  get accountCurrency() {
    return this.originationDetail.get('accountCurrency') as FormGroup;
  }

  get productDetails() {
    return this.originationDetail.get('productDetails') as FormGroup;
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
  onCurrencyChange(selected: any) {
    if (selected) {
      this.accountCurrency.patchValue({
        id: selected.id,
        currencyCode: selected.isoCcyCode,
      });
    }
  }

  handleSubmit() {
    const payload = {
      ...this.accountDetailsForm?.value,
    };
    console.log(payload);

    payload.originationModel.originationId = this.originationId;
    delete payload.loanDetails.totalPrincipalAmount;
    delete payload.customerCategory;
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
