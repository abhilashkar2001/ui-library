import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { LocaleData, selectUser, User } from '@onerumango/utils';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { catchError, map, Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from 'app/shared/services/account.service';
@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  accountDetailsForm!: FormGroup;
  createAccountDetailsSummaryArr: any[] = [];
  genericValue: any | undefined;
  todaysDate = new Date();
  staticData = {
    HOLDERTYPE: [],
  };
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
  selectedAccountType = '';
  data: any;
  basisClass!: string | null;
  customerId: any;
  accountSummaryData: any;
  category: any;
  holderTypeArr: any;
  holderTypeDetails: any;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private accountService: AccountService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
  ) {
    this.basisClass = sessionStorageService.getItem('basisClass');
    this.category = localStorage.getItem('Category');
    this.currentDate?.setDate(this.todaysDate.getDate() + 1);
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
  }

  ngOnInit() {
    this.originationId = this.sessionStorageService.getOriginationId();
    this.holderTypeDetails = JSON.parse(
      localStorage?.getItem('account-type') || '{}',
    );
    this.initializeCreateAccountDetailsArray();
    if (this.originationId) {
      this.fetchAccountDetails();
    }
    this.buildLoanDetailsForm('');
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  initializeCreateAccountDetailsArray(data?: any) {
    this.createAccountDetailsSummaryArr = [
      {
        header: 'Account Type',
        value: data?.originationModel?.accountType,
        formControlName: 'accountType',
      },
      {
        header: 'Account Description',
        value: data?.originationModel?.accountDescription,
        formControlName: 'accountDescription',
      },
      {
        header: 'Business Product Name*',
        value: data?.originationModel?.businessProductName,
        formControlName: 'businessProductName',
        currency: true,
      },
      {
        header: 'Product Description',
        value: data?.originationModel?.productDescription,
        formControlName: 'productDescription',
        currency: true,
      },
    ];
  }

  openAccountType() {
    this.router.navigate(['/account']);
  }

  // fetch Account details function
  fetchAccountDetails() {
    if (this.originationId)
      this.accountService
        .getAccountDetails(this.originationId)
        .subscribe((resp) => {
          if (resp.statusCode === 200) {
            this.initializeCreateAccountDetailsArray(resp?.data);
            this.accountDetailsForm?.patchValue(resp?.data);
          }
        });
  }

  buildLoanDetailsForm(item: any) {
    this.accountDetailsForm = this.fb.group({
      id: [item.id || null],
      productDescription: [item.productDescription || null],
      applicationDate: [item.applicationDate || null],
      userRefNumber: [item.userRefNumber || null],
      cbsRefNumber: [item.cbsRefNumber || null],
      swiftCode: [item.swiftCode || null],
      agentCode: [item.agentCode || null],
      rmId: [item.rmId || null],
      initialFunding: [item.initialFunding ?? false],
      overdraftRequested: [item.overdraftRequested ?? false],
      holderType: [
        this.holderTypeDetails?.holderType ?? item.holderType ?? null,
      ],
      holderTypeId: [
        this.holderTypeDetails?.holderTypeId ?? item.holderTypeId ?? null,
      ],
      noOfApplicant: [item.noOfApplicant || null],
      customerCategoryId: [item.customerCategoryId || null],
      customerCategoryValue: [item.customerCategoryValue || null],
      originationModel: this.fb.group({
        originationId: [
          this.originationId ?? item.originationModel?.originationId ?? null,
        ],
        applicationDate: [item.originationModel?.applicationDate || null],
        icustRefNo: [item.originationModel?.icustRefNo || null],
        source: [item.originationModel?.source || null],
        status: [item.originationModel?.status || null],
        subStatus: [item.originationModel?.subStatus || null],
        branchId: [item.originationModel?.branchId || null],
        branchCode: [item.originationModel?.accountBranch || null],
        currencyId: [item.originationModel?.currencyId || null],
        currencyCode: [item.originationModel?.accountCurrency || null],
        productDetailsId: [item.originationModel?.productDetailsId || null],
      }),
    });
  }

  accountSummaryEmit(event: any) {
    this.accountSummaryData = event;
  }

  handleSubmit() {
    const payload: any = {
      ...this.accountDetailsForm?.value,
      // accountType: this.accountSummaryData?.basisClass,
      // accountDescription: this.accountSummaryData?.basisClassDesc,
      // accountBranch: this.accountSummaryData?.basisName,
      // businessProductName: this.accountSummaryData?.basisDetailStory,
    };
    // this.createAccountDetailsSummaryArr.forEach((item: any) => {
    //   payload[item?.formControlName] = item?.value;
    // });
    // payload.originationDetail.originationId = '2504';
    // delete payload.loanDetails.totalPrincipalAmount;
    // payload.screenCode = 444;

    return this.accountService.saveAccountDetails(payload).pipe(
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
