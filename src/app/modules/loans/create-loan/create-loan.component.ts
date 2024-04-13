import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonService } from "app/shared/services/common-service/common.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import * as moment from "moment";
import { debounceTime } from "rxjs/operators";
import { LoanCalulationService } from "../loan-calculator/loan-calculation.service";
import { CreateLoanConstant, CreateLoanEnum } from "./create-loan.constant";
import { TokenStorageService } from "app/shared/token-storage.service";
import { SharedService } from "app/shared/shared.service";
import { combineLatest, merge, Subscription } from "rxjs";

@Component({
  selector: "app-create-loan",
  templateUrl: "./create-loan.component.html",
  styleUrls: ["./create-loan.component.scss"],
})
export class CreateLoanComponent implements OnInit {
  personalLoanDetailsForm: FormGroup;
  loanEnum = CreateLoanEnum;
  // decorates for component communication.
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;

  // variables with static data.
  currencySymboll = CreateLoanConstant.CURRENCY_SYMBOLL;
  screenName: string = CreateLoanConstant.SCREEN_NAME;
  staticData = CreateLoanConstant.GENERIC_SATIC_KEYS;
  accountTypeArr = CreateLoanConstant.ACCOUNT_TYPE;
  staticOwnership = {
    OWNERSHIP: [],
  };

  disbursementType: string;
  loanDetails: any;
  isDisabledMode: boolean = true;
  isReadOnly: boolean = true;
  loanCustomerId: string;
  accountList: any;
  currentDate = new Date();
  productDetails: any;
  otherUserInfo: any;
  ownerShipId: any;
  valueChangesSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private loanApi: LoanService,
    private snack: MatSnackBar,
    private openApi: OpenAccountService,
    private loanCalcService: LoanCalulationService,
    private tokenStore: TokenStorageService,
    private sharedService: SharedService
  ) {
    this.currentDate.setDate(new Date().getDate() + 1);
  }

  ngOnInit(): void {
    this.otherUserInfo = this.tokenStore.getUserOtherInfo();
    this.currencySymboll = this.otherUserInfo?.currencySymbol;
    const basisId = sessionStorage.getItem("loanBasisDetails");
    this.getProductDetails(JSON.parse(basisId).basisId);
    this.getGenericDetails();
    this.loanCustomerId = sessionStorage.getItem("customerId");
    if (this.loanCustomerId) this.getCustomerById();
    var id = parseInt(sessionStorage.getItem("loanDisburseId"));
    if (id) this.getLoanById(id);
    else this.initialForm();
  }

  getProductDetails(basisId) {
    this.loanApi.getProductAspectDetails(basisId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.productDetails = resp.data[0].lendingParameters.find(
          (el) => el.currency == this.otherUserInfo.currency
        );
      }
    });
  }

  getCustomerById() {
    this.openApi
      .getCustomerById(parseInt(this.loanCustomerId))
      .subscribe((resp) => {
        if (resp?.statusCode == 200) {
          if (resp?.data[0]?.customerNo) {
            this.getAccountList(resp?.data[0]?.customerNo);
          }
        }
      });
  }

  getAccountList(customerNo) {
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
      .genericValue(this.screenName, Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.staticData = { ...resp.data };
        }
      });
  }

  /**
   * Api call to fetch webDisbursement by id.
   * @param id webdisbursementId
   */
  getLoanById(id) {
    this.loanApi.getLoanById(id).subscribe(
      (resp) => {
        if (resp.statusCode === 200) {
          this.initialForm({
            ...resp?.data,
            tenureDays: sessionStorage.getItem("tenureDays") || 0,
            tenureYear: sessionStorage.getItem("tenureYear") || 0,
            tenureMonth: sessionStorage.getItem("tenureMonth") || 0,
          });
        } else {
          this.initialForm();
        }
      },
      (Error) => {
        this.initialForm();
      }
    );
  }

  /**
   * building  personalLoanDetailsForm form. & changeDetiction.
   * @param data is formData
   */
  initialForm(data?) {
    var holderType = sessionStorage.getItem("loanHolderType");
    this.personalLoanDetailsForm = this.fb.group({
      loanAmount: [data ? data.principalAmount : "", Validators.required],
      tenureYear: [data ? data?.tenureYear : ""],
      tenureMonth: [data ? data?.tenureMonth : ""],
      tenureDays: [data ? data?.tenureDays : ""],
      emiStartDate: [data ? data?.emiStartDate : "", Validators.required],
      emiAmount: [data ? data?.emiAmount : "", [Validators.required]],
      interestRate: [data ? data.interestRate : "", Validators.required],
      interestPayable: [data ? data.interestPayable : "", Validators.required],
      principlAmount: [data ? data.principalAmount : "", Validators.required],
      holderType: [holderType ? holderType : "", Validators.required],
      totalPayableAmount: [
        data ? data.totalPayableAmount : "",
        Validators.required,
      ],
      disbursementType: [
        data ? data?.disbursementType : "",
        Validators.required,
      ],
      accountNumber: [data ? data?.accountNumber : ""],
      id: data?.id,
      bankCode: [data ? data?.bankCode : ""],
      accountType: this.loanEnum.INTERNAL,
      ifscCode: [data ? data?.ifscCode : ""],
      branchCode: [data ? data?.branchCode : ""],
      confirmAccountNumber: "",
    });
    if (data) this.disbursementType = data?.disbursementType.toLowerCase();

    this.personalLoanDetailsForm
      .get("accountNumber")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        if (
          resp &&
          this.personalLoanDetailsForm.value.accountType ===
            this.loanEnum.INTERNAL
        ) {
          this.validateAccountNumber(resp);
        }
      });
    // this.personalLoanDetailsForm
    //   .get("loanAmount")
    //   .valueChanges.pipe(debounceTime(200))
    //   .subscribe((resp) => {
    //     if (resp) {
    //       this.personalLoanDetailsForm.get("principlAmount").setValue(resp);
    //     }
    //   });

    const interestRate$ = this.personalLoanDetailsForm
      .get("interestRate")
      .valueChanges.pipe(debounceTime(1000));
    const tenureDays$ = this.personalLoanDetailsForm
      .get("tenureDays")
      .valueChanges.pipe(debounceTime(1000));
    const tenureYear$ = this.personalLoanDetailsForm
      .get("tenureYear")
      .valueChanges.pipe(debounceTime(1000));
    const tenureMonth$ = this.personalLoanDetailsForm
      .get("tenureMonth")
      .valueChanges.pipe(debounceTime(1000));
    const loanAmount$ = this.personalLoanDetailsForm
      .get("loanAmount")
      .valueChanges.pipe(debounceTime(1000));

    merge(
      interestRate$,
      tenureDays$,
      tenureMonth$,
      tenureYear$,
      loanAmount$
    ).subscribe(([loanAmount]) => {
      if (loanAmount)
        this.personalLoanDetailsForm
          .get("principlAmount")
          .setValue(this.personalLoanDetailsForm.get("loanAmount").value);
      if (
        this.personalLoanDetailsForm.value.interestRate &&
        this.personalLoanDetailsForm.value.loanAmount &&
        (this.personalLoanDetailsForm.value.tenureYear ||
          this.personalLoanDetailsForm.value.tenureMonth ||
          this.personalLoanDetailsForm.value.tenureDays)
      ) {
        this.calculateLoan();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  calculateTenure(years, months, days) {
    return new Promise((resolve, reject) => {
      const totalMonths = years * 12 + months;
      const daysInMonth = days ? Math.ceil(days / 30) : 0;
      const totalMonthsIncludingDays = totalMonths + daysInMonth;
      console.log(totalMonthsIncludingDays);
      resolve(totalMonthsIncludingDays);
    });
  }

  /**
   * calculation interestPayable, totalPayableAmount, emiAmount
   */
  calculateLoan() {
    this.calculateTenure(
      parseInt(this.personalLoanDetailsForm.value.tenureYear) || 0,
      parseInt(this.personalLoanDetailsForm.value.tenureMonth) || 0,
      parseInt(this.personalLoanDetailsForm.value.tenureDays) || 0
    ).then((result) => {
      console.log("./////////");
      const payload = {
        principleAmount: parseInt(
          this.personalLoanDetailsForm.value.loanAmount
        ),
        interestRate: parseFloat(
          this.personalLoanDetailsForm.value.interestRate
        ),
        numberOfMonths: result,
        firstRepaymentDate: moment(new Date()).format("DD-MM-YYYY"),
      };
      this.loanApi.getEmiCalculation(payload).subscribe((resp: any) => {
        this.personalLoanDetailsForm
          .get("interestPayable")
          .setValue(Math.round(resp.data.totalInterest));
        this.personalLoanDetailsForm
          .get("totalPayableAmount")
          .setValue(Math.round(resp.data.totalRepaymentAmount));
        this.personalLoanDetailsForm
          .get("emiAmount")
          .setValue(Math.round(resp.data.monthlyPayment));
      });
    });
  }

  /**
   * account number validation.
   */
  onChange() {
    if (
      this.personalLoanDetailsForm.value.accountNumber &&
      this.personalLoanDetailsForm.value.accountType === this.loanEnum.INTERNAL
    ) {
      this.validateAccountNumber(
        this.personalLoanDetailsForm.value.accountNumber
      );
    } else this.personalLoanDetailsForm.get("accountNumber").setErrors(null);
  }

  /**
   * api call for account number validation, if account Number not present then invalidAccount error will throw in html.
   */

  validateAccountNumber(resp) {
    this.loanApi.checkAccountNumberAvilable(resp).subscribe((data) => {
      if (!data) {
        this.personalLoanDetailsForm
          .get("accountNumber")
          .setErrors({ invalidAccount: true });
      } else {
        this.personalLoanDetailsForm.get("accountNumber").setErrors(null);
      }
    });
  }

  /**
   *
   * @param event is disbursement change value
   */
  onDisbursementSelectionChanged(event) {
    this.disbursementType = this.staticData["DISBURSEMENTTYPE"]
      .filter(
        (item) =>
          item?.id ==
          this.personalLoanDetailsForm.controls["disbursementType"].value
      )[0]
      .values.toLowerCase();

    if (
      this.disbursementType.includes(this.loanEnum.ACCOUNT_INCLUDES_KEY) &&
      this.personalLoanDetailsForm.value.accountType === this.loanEnum.INTERNAL
    ) {
      this.personalLoanDetailsForm.controls["accountNumber"].setValidators([
        Validators.required,
      ]);
    } else {
      this.personalLoanDetailsForm.controls["accountNumber"].clearValidators();
    }

    this.personalLoanDetailsForm.controls[
      "accountNumber"
    ].updateValueAndValidity();
  }

  /**
   * 1) check form validity.
   * 2) api call to submit create loan.
   * @returns void if form is invalid
   */
  onConfirm() {
    if (this.personalLoanDetailsForm.invalid || this.validateMinimumTenure) {
      return;
    }
    const loanAmmount = JSON.stringify({
      loanAmount: this.personalLoanDetailsForm.value.loanAmount || 20000,
      loanTenure: `${this.personalLoanDetailsForm.value.tenureYear}Years ${this.personalLoanDetailsForm.value.tenureMonth} months ${this.personalLoanDetailsForm.value.tenureDays} Days`,
    });
    sessionStorage.setItem("loanAmmount", loanAmmount);
    const holder = this.staticData["HOLDERTYPE"]
      .filter(
        (item) =>
          item?.id == this.personalLoanDetailsForm.controls["holderType"].value
      )[0]
      .values.toLowerCase();
    sessionStorage.setItem("loanHolderType", holder);
    this.getOwnershipIdByGeneric(holder);
    this.loanApi.submitLoanDetail(this.calculatePayload()).subscribe((resp) => {
      if (resp?.statusCode === 201) {
        this.snack.open(`Create Loan Details Saved !`, "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
        });
        sessionStorage.setItem("loanDisburseId", resp.data.id);
        sessionStorage.setItem(
          "tenureYear",
          this.personalLoanDetailsForm.value.tenureYear
        );
        sessionStorage.setItem(
          "tenureMonth",
          this.personalLoanDetailsForm.value.tenureMonth
        );
        sessionStorage.setItem(
          "tenureDays",
          this.personalLoanDetailsForm.value.tenureDays
        );
        this.updateParentModel({ updateMasterSave: false });
        this.onCustomSubmit.emit(this.personalLoanDetailsForm);
      }
    });
  }

  /**
   * method to create a payload.
   * @returns payload
   */
  calculatePayload() {
    var payload: any = {
      emiAmount: parseInt(this.personalLoanDetailsForm.value.emiAmount),
      interestRate: parseInt(this.personalLoanDetailsForm.value.interestRate),
      interestPayable: parseInt(
        this.personalLoanDetailsForm.value.principlAmount
      ),
      principalAmount: parseInt(
        this.personalLoanDetailsForm.value.principlAmount
      ),
      totalPayableAmount: parseInt(
        this.personalLoanDetailsForm.value.totalPayableAmount
      ),
      disbursementType: this.personalLoanDetailsForm.value.disbursementType,
      emiStartDate: moment(
        this.personalLoanDetailsForm.value.emiStartDate
      ).format(),
      bankCode: this.personalLoanDetailsForm.value.bankCode,
      branchCode: this.personalLoanDetailsForm.value.branchCode,
      ifscCode: this.personalLoanDetailsForm.value.ifscCode,
    };
    if (this.personalLoanDetailsForm.value?.id) {
      payload.id = this.personalLoanDetailsForm.value?.id;
    }
    if (
      this.disbursementType.includes(this.loanEnum.ACCOUNT_INCLUDES_KEY) &&
      this.personalLoanDetailsForm.value?.accountType === this.loanEnum.EXTERNAL
    ) {
      payload.otherAccNo = this.personalLoanDetailsForm.value.accountNumber;
      payload.accountNumber = null;
      payload.external = true;
    } else {
      payload.otherAccNo = "";
      payload.accountNumber = this.personalLoanDetailsForm.value.accountNumber;
      payload.external = false;
    }
    payload.disbursementAccInfo = {
      accountNo: this.personalLoanDetailsForm.value.accountNumber,
      bankCode: this.personalLoanDetailsForm.value.bankCode,
      branchCode: this.personalLoanDetailsForm.value.branchCode,
    };
    return payload;
  }

  /**
   * navigating back screen.
   */
  onBack() {
    this.onBackEvent.emit();
  }

  /**
   * edit boolean change.
   */
  editRecord() {
    this.isReadOnly = false;
  }

  calculateTotalDays(loanTenureYear, loanTenureMonth, loanTenureDay) {
    const d = +loanTenureYear * 365 + +loanTenureMonth * 30 + +loanTenureDay;
    return d;
  }

  get validateTenure() {
    let totalDays = this.calculateTotalDays(
      this.personalLoanDetailsForm.value.tenureYear || 0,
      this.personalLoanDetailsForm.value.tenureMonth || 0,
      this.personalLoanDetailsForm.value.tenureDays || 0
    );
    let totalAllowedDays = this.calculateTotalDays(
      this.productDetails?.maximumTenorYear || 0,
      this.productDetails?.maximumTenorMonth || 0,
      this.productDetails?.maximumTenorDay || 0
    );
    return totalDays >= totalAllowedDays;
  }

  get validateMinimumTenure() {
    let totalDays = this.calculateTotalDays(
      this.personalLoanDetailsForm.value.tenureYear || 0,
      this.personalLoanDetailsForm.value.tenureMonth || 0,
      this.personalLoanDetailsForm.value.tenureDays || 0
    );
    let MinimumAllowedDays = this.calculateTotalDays(
      this.productDetails?.minimumTenorYear || 0,
      this.productDetails?.minimumTenorMonth || 0,
      this.productDetails?.minimumTenorDay || 0
    );
    return totalDays <= MinimumAllowedDays;
  }

  getOwnershipIdByGeneric(value) {
    let ownership = [];
    this.sharedService
      .genericValue("Common", Object.keys(this.staticOwnership))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          ownership = resp.data["OWNERSHIP"];
          this.ownerShipId = ownership.find(
            (r) => r?.values?.toLowerCase() === value?.toLowerCase()
          )?.id;
          sessionStorage.setItem("ownershipId", this.ownerShipId);
        }
      });
  }
}
