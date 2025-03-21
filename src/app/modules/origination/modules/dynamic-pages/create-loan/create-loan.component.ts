import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { CreateLoanConstant, CreateLoanEnum } from './create-loan.constant';
import { IcScreen, LocaleData, selectLocaleData } from '@onerumango/utils';
import { merge, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { Store } from '@ngrx/store';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { GenericValueData } from '../../../../../shared/models/generic-value.model';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.scss'],
})
export class CreateLoanComponent implements OnInit, OnDestroy {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  @Input() mobileVerifyInfo: any;
  @Input() screenInfo!: IcScreen;

  personalLoanDetailsForm: FormGroup | undefined;
  loanEnum = CreateLoanEnum;

  currencySymboll = CreateLoanConstant.CURRENCY_SYMBOLL;
  screenName: string = CreateLoanConstant.SCREEN_NAME;
  staticData = CreateLoanConstant.GENERIC_SATIC_KEYS;
  holderTypeArray: any[] = [{}];
  disbursementTypeArray: any[] = [{}];
  staticOwnership = {
    OWNERSHIP: [],
  };

  disbursementTypeId: string | undefined;
  loanDetails: any;
  isReadOnly = true;
  loanCustomerId: number | undefined;
  accountList: any;
  currentDate = new Date();
  productDetails: any;
  otherUserInfo: LocaleData | undefined;
  ownerShipId: number | undefined;
  valueChangesSubscription: Subscription | any;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private loanApi: LoanService,
    private snack: MatSnackBar,
    private openApi: OpenAccountService,
    private genericValueService: GenericValueService,
    private sessionStorageService: SessionStorageService,
    private store: Store,
    private matIconRegiostry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.currentDate.setDate(new Date().getDate() + 1);
    this.matIconRegiostry.addSvgIcon(
      `calendar`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/calendar.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.loadLocaleData();
    const basisId = this.sessionStorageService.getLoanBasisDetails();
    this.getProductDetails(basisId.basisId);
    this.getGenericDetails();
    this.loanCustomerId = this.sessionStorageService.getCustomerId();
    if (this.loanCustomerId) this.getCustomerById();
    const id = this.sessionStorageService.getLoanDisburseId();
    if (id) this.getLoanById(id);
    else this.initialForm();
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

  getProductDetails(basisId: number) {
    this.loanApi.getProductAspectDetails(basisId).subscribe((resp) => {
      if (resp?.statusCode === 200 && resp?.data?.length > 0) {
        this.productDetails = resp.data[0]?.lendingParameters.find(
          (el: any) => el.currency == this.otherUserInfo?.currency,
        );
      }
    });
  }

  getCustomerById() {
    if (!this.loanCustomerId) return;
    this.openApi.getCustomerById(this.loanCustomerId).subscribe((resp) => {
      if (resp?.statusCode == 200) {
        if (resp?.data[0]?.customerNo) {
          this.getAccountList(resp?.data[0]?.customerNo);
        }
      }
    });
  }

  getAccountList(customerNo: any) {
    this.loanApi.getAccountList(customerNo).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.accountList = resp.data.accountInfo;
      }
    });
  }

  /**
   * Api call to get the generic details
   */
  getGenericDetails() {
    this.loanApi
      .genericValue(this.screenInfo?.screenCode, Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.staticData = { ...resp.data };
          this.holderTypeArray = resp.data['HOLDERTYPE'];
          this.disbursementTypeArray = resp.data['DISBURSEMENTTYPE'];
          if (
            this.personalLoanDetailsForm &&
            !this.mobileVerifyInfo?.individual
          ) {
            this.setJointAsHolderType();
          }
        }
      });
  }

  /**
   * Api call to fetch webDisbursement by id.
   * @param id webdisbursementId
   */
  getLoanById(id: number) {
    this.loanApi.getLoanById(id).subscribe({
      next: (resp) => {
        if (resp.statusCode === 200) {
          this.initialForm({
            ...resp?.data,
            tenureDays: this.sessionStorageService.getTenureDays() || 0,
            tenureYear: this.sessionStorageService.getTenureYear() || 0,
            tenureMonth: this.sessionStorageService.getTenureMonth() || 0,
          });
          if (
            this.holderTypeArray?.length > 0 &&
            !this.personalLoanDetailsForm?.get('holderType')?.value &&
            !this.mobileVerifyInfo?.individual
          ) {
            this.setJointAsHolderType();
          }
        } else {
          this.initialForm();
        }
      },
      error: () => {
        this.initialForm();
      },
    });
  }

  /**
   * If the loan application is for corporate then by default customer type would be join
   */
  setJointAsHolderType() {
    const jointHolderId = this.holderTypeArray.find(
      (item) => item?.values === 'Joint',
    )?.id;
    this.personalLoanDetailsForm?.get('holderType')?.setValue(jointHolderId);
  }
  /**
   * building  personalLoanDetailsForm form. & changeDetiction.
   * @param data is formData
   */
  initialForm(data?: any) {
    const holderType = this.sessionStorageService.getLoanHolderType();
    this.personalLoanDetailsForm = this.fb.group({
      loanAmount: [data ? data.principalAmount : '', Validators.required],
      tenureYear: [data ? data?.tenureYear : ''],
      tenureMonth: [data ? data?.tenureMonth : ''],
      tenureDays: [data ? data?.tenureDays : ''],
      emiStartDate: [data ? data?.emiStartDate : '', Validators.required],
      emiAmount: [data ? data?.emiAmount : '', [Validators.required]],
      interestRate: [data ? data.interestRate : '', Validators.required],
      interestPayable: [data ? data.interestPayable : '', Validators.required],
      principlAmount: [data ? data.principalAmount : '', Validators.required],
      holderType: [holderType ? holderType : '', Validators.required],
      totalPayableAmount: [
        data ? data.totalPayableAmount : '',
        Validators.required,
      ],
      disbursementTypeId: [data ? data?.disbursementTypeId : ''],
      accountNumber: [data ? data?.accountNumber : ''],
      id: data?.id,
      bankCode: [data ? data?.bankCode : ''],
      accountType: this.loanEnum.INTERNAL,
      ifscCode: [data ? data?.ifscCode : ''],
      branchCode: [data ? data?.branchCode : ''],
      confirmAccountNumber: '',
    });

    this.personalLoanDetailsForm
      ?.get('accountNumber')
      ?.valueChanges.pipe(debounceTime(500))
      ?.subscribe((resp: any) => {
        if (
          resp &&
          this.personalLoanDetailsForm?.value.accountType ===
            this.loanEnum.INTERNAL
        ) {
          this.validateAccountNumber(resp);
        }
      });

    const interestRate$ = this.personalLoanDetailsForm
      ?.get('interestRate')
      ?.valueChanges.pipe(debounceTime(500));
    const tenureDays$ = this.personalLoanDetailsForm
      ?.get('tenureDays')
      ?.valueChanges.pipe(debounceTime(500));
    const tenureYear$ = this.personalLoanDetailsForm
      ?.get('tenureYear')
      ?.valueChanges.pipe(debounceTime(500));
    const tenureMonth$ = this.personalLoanDetailsForm
      ?.get('tenureMonth')
      ?.valueChanges.pipe(debounceTime(500));
    const loanAmount$ = this.personalLoanDetailsForm
      ?.get('loanAmount')
      ?.valueChanges.pipe(debounceTime(500));

    if (
      interestRate$ &&
      tenureDays$ &&
      tenureMonth$ &&
      tenureYear$ &&
      loanAmount$
    )
      merge(
        interestRate$,
        tenureDays$,
        tenureMonth$,
        tenureYear$,
        loanAmount$,
      ).subscribe((loanAmount) => {
        if (loanAmount)
          this.personalLoanDetailsForm
            ?.get('principlAmount')
            ?.setValue(this.personalLoanDetailsForm?.get('loanAmount')?.value);
        if (
          this.personalLoanDetailsForm?.value?.interestRate &&
          this.personalLoanDetailsForm?.value?.loanAmount &&
          (this.personalLoanDetailsForm?.value?.tenureYear ||
            this.personalLoanDetailsForm?.value?.tenureMonth ||
            this.personalLoanDetailsForm?.value?.tenureDays)
        ) {
          this.calculateLoan();
        }
      });
  }

  isHolderTypeRequired(): boolean {
    return (
      this.personalLoanDetailsForm
        ?.get('holderType')
        ?.hasValidator(Validators.required) ?? false
    );
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }

    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  calculateTenure(years: any, months: any, days: any) {
    return new Promise((resolve) => {
      const totalMonths = years * 12 + months;
      const daysInMonth = days ? Math.ceil(days / 30) : 0;
      const totalMonthsIncludingDays = totalMonths + daysInMonth;
      resolve(totalMonthsIncludingDays);
    });
  }

  /**
   * calculation interestPayable, totalPayableAmount, emiAmount
   */
  calculateLoan() {
    this.calculateTenure(
      parseInt(this.personalLoanDetailsForm?.value.tenureYear) || 0,
      parseInt(this.personalLoanDetailsForm?.value.tenureMonth) || 0,
      parseInt(this.personalLoanDetailsForm?.value.tenureDays) || 0,
    ).then((result) => {
      const payload = {
        principleAmount: parseInt(
          this.personalLoanDetailsForm?.value.loanAmount,
        ),
        interestRate: parseFloat(
          this.personalLoanDetailsForm?.value.interestRate,
        ),
        numberOfMonths: result,
        firstRepaymentDate: moment(new Date()).format('DD-MM-YYYY'),
      };
      this.loanApi.getEmiCalculation(payload).subscribe((resp: any) => {
        this.personalLoanDetailsForm
          ?.get('interestPayable')
          ?.setValue(Math.round(resp.data.totalInterest));
        this.personalLoanDetailsForm
          ?.get('totalPayableAmount')
          ?.setValue(Math.round(resp.data.totalRepaymentAmount));
        this.personalLoanDetailsForm
          ?.get('emiAmount')
          ?.setValue(Math.round(resp.data.monthlyPayment));
      });
    });
  }

  /**
   * account number validation.
   */
  onChange() {
    this.personalLoanDetailsForm?.get('accountNumber')?.setValue(null);
    if (
      this.personalLoanDetailsForm?.value?.accountNumber &&
      this.personalLoanDetailsForm?.value?.accountType ===
        this.loanEnum.INTERNAL
    ) {
      this.validateAccountNumber(
        this.personalLoanDetailsForm.value.accountNumber,
      );
    } else this.personalLoanDetailsForm?.get('accountNumber')?.setErrors(null);
  }

  /**
   * api call for account number validation, if account Number not present then invalidAccount error will throw in html.
   */

  validateAccountNumber(resp: any) {
    this.loanApi.checkAccountNumberAvilable(resp).subscribe((data) => {
      if (!data) {
        this.personalLoanDetailsForm
          ?.get('accountNumber')
          ?.setErrors({ invalidAccount: true });
      } else {
        this.personalLoanDetailsForm?.get('accountNumber')?.setErrors(null);
      }
    });
  }

  /**
   * 1) check form validity.
   * 2) api call to submit create loan.
   * @returns void if form is invalid
   */
  onConfirm() {
    if (this.personalLoanDetailsForm?.invalid || this.validateMinimumTenure) {
      console.log(this.personalLoanDetailsForm, this.validateMinimumTenure);
      return;
    }
    const loanAmmount = {
      loanAmount: this.personalLoanDetailsForm?.value.loanAmount || 20000,
      loanTenure: `${this.personalLoanDetailsForm?.value.tenureYear}Years ${this.personalLoanDetailsForm?.value?.tenureMonth} months ${this.personalLoanDetailsForm?.value?.tenureDays} Days`,
    };
    this.sessionStorageService.setLoanAmount(loanAmmount);
    const holder: any = (
      this.staticData['HOLDERTYPE'] as { id: any; values: string }[]
    )
      .filter(
        (item: any) =>
          item?.id ==
          this.personalLoanDetailsForm?.controls['holderType']?.value,
      )[0]
      ?.values.toLowerCase();
    this.sessionStorageService.setLoanHolderType(holder);
    this.getOwnershipIdByGeneric(holder);
    this.snack.open(`Create Loan Details Saved !`, 'OK', {
      duration: 4000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
    this.sessionStorageService.setLoanDisburseId(this.calculatePayload().id);
    this.sessionStorageService.setTenureYear(
      this.personalLoanDetailsForm?.value.tenureYear,
    );
    this.sessionStorageService.setTenureMonth(
      this.personalLoanDetailsForm?.value.tenureMonth,
    );
    this.sessionStorageService.setTenureDays(
      this.personalLoanDetailsForm?.value.tenureDays,
    );
    this.updateParentModel({
      updateMasterSave: false,
      disbursementDetails: this.calculatePayload(),
    });
    this.CustomSubmit.emit(this.personalLoanDetailsForm);
  }

  /**
   * method to create a payload.
   * @returns payload
   */
  calculatePayload() {
    const payload: any = {
      emiAmount: parseInt(this.personalLoanDetailsForm?.value.emiAmount),
      interestRate: this.personalLoanDetailsForm?.value.interestRate,
      interestPayable: parseInt(
        this.personalLoanDetailsForm?.value.interestPayable,
      ),
      principalAmount: parseInt(
        this.personalLoanDetailsForm?.value.principlAmount,
      ),
      totalPayableAmount: parseInt(
        this.personalLoanDetailsForm?.value.totalPayableAmount,
      ),
      disbursementTypeId:
        this.personalLoanDetailsForm?.value.disbursementTypeId,
      emiStartDate: moment(
        this.personalLoanDetailsForm?.value.emiStartDate,
      ).format(),
      bankCode: this.personalLoanDetailsForm?.value.bankCode,
      branchCode: this.personalLoanDetailsForm?.value.branchCode,
      ifscCode: this.personalLoanDetailsForm?.value.ifscCode,
    };
    if (this.personalLoanDetailsForm?.value?.id) {
      payload.id = this.personalLoanDetailsForm?.value?.id;
    }
    payload.disbursementAccInfo = {
      accountNo: this.personalLoanDetailsForm?.value.accountNumber,
      bankCode: this.personalLoanDetailsForm?.value.bankCode,
      branchCode: this.personalLoanDetailsForm?.value.branchCode,
    };
    return payload;
  }

  /**
   * navigating back screen.
   */
  onBack() {
    this.backEvent.emit();
  }

  calculateTotalDays(
    loanTenureYear: any,
    loanTenureMonth: any,
    loanTenureDay: any,
  ) {
    const d = +loanTenureYear * 365 + +loanTenureMonth * 30 + +loanTenureDay;
    return d;
  }

  get validateTenure() {
    const totalDays = this.calculateTotalDays(
      this.personalLoanDetailsForm?.value.tenureYear || 0,
      this.personalLoanDetailsForm?.value.tenureMonth || 0,
      this.personalLoanDetailsForm?.value.tenureDays || 0,
    );
    const totalAllowedDays = this.calculateTotalDays(
      this.productDetails?.maximumTenorYear || 0,
      this.productDetails?.maximumTenorMonth || 0,
      this.productDetails?.maximumTenorDay || 0,
    );
    return totalDays >= totalAllowedDays;
  }

  get validateMinimumTenure() {
    const totalDays = this.calculateTotalDays(
      this.personalLoanDetailsForm?.value.tenureYear || 0,
      this.personalLoanDetailsForm?.value.tenureMonth || 0,
      this.personalLoanDetailsForm?.value.tenureDays || 0,
    );
    const MinimumAllowedDays = this.calculateTotalDays(
      this.productDetails?.minimumTenorYear || 0,
      this.productDetails?.minimumTenorMonth || 0,
      this.productDetails?.minimumTenorDay || 0,
    );
    return totalDays <= MinimumAllowedDays;
  }

  getOwnershipIdByGeneric(value: string) {
    let ownership: GenericValueData[] = [];
    this.genericValueService
      .loadGenericValue(Object.keys(this.staticOwnership))
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          ownership = resp.data['OWNERSHIP'] ?? [];
          this.ownerShipId = ownership.find(
            (r) => r?.values?.toLowerCase() === value?.toLowerCase(),
          )?.id;
          if (!this.ownerShipId) return;
          this.sessionStorageService.setOriginationId(this.ownerShipId);
        }
      });
  }
}
