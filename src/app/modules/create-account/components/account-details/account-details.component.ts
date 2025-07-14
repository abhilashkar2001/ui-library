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
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
// import moment from 'moment';
import { catchError, map, Observable, of, Subscription, tap } from 'rxjs';
// import { AccountSelectionComponent } from '../account-selection/account-selection.component';
import { ActivatedRoute } from '@angular/router';

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
    REPAYMENTFREQUENCY: [],
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

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService,
    private store: Store,
    private loanService: LoanService,
    // private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.currentDate?.setDate(this.todaysDate.getDate() + 1);
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
    this.data = this.activatedRoute.snapshot['queryParams']['type'];
    console.log(this.data);
    console.log(this.activatedRoute);

    // this.loadLocaleData();
  }

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.fetchGenericValues();
    this.initializeCreateAccountDetailsArray();
    if (this.originationId) {
      this.fetchLoanDetails();
    }
    this.buildLoanDetailsForm();

    const validValues = this.holderTypeArr.map((item) => item.value);
    const accountType = localStorage.getItem('account-type') || '';
    if (validValues.includes(accountType)) {
      this.accountDetailsForm
        ?.get('accountDetails.holderType')
        ?.setValue(accountType);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEdit']) {
      console.log('Edit mode ON');
    }
  }

  holderTypeChange(){
    localStorage.setItem('account-type',this.accountDetailsForm?.get('accountDetails.holderType')?.value);
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
    this.createAccountDetailsSummaryArr = [
      {
        header: 'Account Type',
        value: `Current`,
        formControlName: 'accountType',
        currency: true,
      },
      {
        header: 'Account Description',
        value: `Allows you to deposit your Money,
Safe with the bank`,
        formControlName: 'accountDescription',
      },
      {
        header: 'Business Product Name',
        value: `Resident Account`,
        formControlName: 'businessProductName',
        currency: true,
      },
      {
        header: 'Product Description',
        value: `Safegaurd your money and Pays
a certain amount of interest`,
        formControlName: 'productDescription',
        currency: true,
      },
    ];
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

  get holderType() {
    return this.accountDetailsForm?.get('holderType')?.value;
  }

  // Build Form
  buildLoanDetailsForm() {
    this.accountDetailsForm = this.fb.group({
      originationModel: this.fb.group({
        originationId: [''],
      }),
      accountDetails: this.fb.group({
        accountType: [''],
        businessProductName: [''],
        accountDescription: [''],
        productDescription: [''],
        accountBranch: [''],
        accountCurrency: [''],
        noOfApplicant: [''],
        noOfGuardian: [''],
        customerCategory: [''],
        holderType: [''],
        initialFunding: [''],
        overdraftRequested: [''],
      }),

      screenCode: [''],
    });

    this.accountDetailsForm
      .get('accountDetails.holderType')
      ?.valueChanges.subscribe((holderType: string) => {
        console.log(holderType);

        if (holderType?.toLowerCase() === 'joint') {
          this.accountDetailsForm
            .get('accountDetails.noOfApplicant')
            ?.setValue(2);
        } else {
          this.accountDetailsForm.get('accountDetails.noOfApplicant')?.reset();
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

  handleSubmit() {
    const payload = {
      ...this.accountDetailsForm?.value,
    };
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
