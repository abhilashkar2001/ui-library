import { Location } from "@angular/common";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import * as moment from "moment";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-create-loan",
  templateUrl: "./create-loan.component.html",
  styleUrls: ["./create-loan.component.scss"],
})
export class CreateLoanComponent implements OnInit, OnChanges, AfterViewInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onSaveCreateLoan: EventEmitter<any> = new EventEmitter();
  @Output() checkAccountHolderType: EventEmitter<any> = new EventEmitter();

  personalLoanDetailsForm: FormGroup | any;
  stepperTitle: string;
  disbursementType: string;
  loanDetails: any;
  isDisabledMode: boolean = true;
  submitedLoan: any;
  staticData = {
    HOLDERTYPE: [],
    DISBURSEMENTTYPE: [],
  };
  holderTypeArray: string[] = [];
  disbursementArray: string[] = [];
  isReadOnly: boolean = true;
  loanCustomerId: string;
  accountList: any;
  currentDate = new Date();
  currencySymboll = "₹";

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private loanApi: LoanService,
    private snack: MatSnackBar,
    private router: Router,
    private openApi: OpenAccountService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.getGenericDetails();
    this.loanCustomerId = sessionStorage.getItem("customerId");
    if (this.loanCustomerId) this.getCustomerById();
    var id = parseInt(sessionStorage.getItem("loanDisburseId"));
    if (id) this.getLoanById(id);
    else this.initialForm();
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

  getGenericDetails() {
    this.loanApi
      .genericValue("website", Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.holderTypeArray = resp.data["HOLDERTYPE"];
          this.disbursementArray = resp.data["DISBURSEMENTTYPE"];
        }
      });
  }

  getLoanById(id) {
    this.loanApi.getLoanById(id).subscribe(
      (resp) => {
        if (resp.statusCode === 200) {
          this.initialForm(resp?.data); // once fetchById api working then use this
          //this.initialForm();
          const tenureDays = sessionStorage.getItem("tenureDays");
          const tenureYear = sessionStorage.getItem("tenureYear");
          const tenureMonth = sessionStorage.getItem("tenureMonth");
          this.personalLoanDetailsForm.controls.tenureDays.setValue(tenureDays);
          this.personalLoanDetailsForm.controls.tenureYear.setValue(tenureYear);
          this.personalLoanDetailsForm.controls.tenureMonth.setValue(
            tenureMonth
          );
        } else {
          this.initialForm();
        }
      },
      (Error) => {
        this.initialForm();
      }
    );
  }

  ngAfterViewInit(): void {
    this.commonService.$calculatorsData.subscribe((response: any) => {
      //  this.setValues(response);
    });
  }

  initialForm(data?) {
    var holderType = sessionStorage.getItem("loanHolderType");
    this.personalLoanDetailsForm = this.fb.group({
      loanAmount: [data ? data?.emiAmount : "", Validators.required],
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
      accountType: "internal",
      ifscCode: [data ? data?.ifscCode : ""],
      branchCode: [data ? data?.branchCode : ""],
      confirmAccountNumber: "",
    });
    if (data) this.disbursementType = data?.disbursementType.toLowerCase();
    this.personalLoanDetailsForm
      .get("accountNumber")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        if (resp) {
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
      });
  }

  onChange() {
    console.log(this.personalLoanDetailsForm.value);
  }

  accountHolderSelectionChanged() {
    this.checkAccountHolderType.emit(
      this.personalLoanDetailsForm.controls["holderType"].value.toLowerCase()
    );
  }

  onDisbursementSelectionChanged(event) {
    this.disbursementType =
      this.personalLoanDetailsForm.controls[
        "disbursementType"
      ].value.toLowerCase();
    if (event.toLowerCase().includes("account")) {
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

  onConfirm() {
    console.log(this.personalLoanDetailsForm.value);
    if (this.personalLoanDetailsForm.invalid) {
      return;
    }
    const loanAmmount = JSON.stringify({
      loanAmount: this.personalLoanDetailsForm.value.loanAmount || 20000,
      loanTenure: `${this.personalLoanDetailsForm.value.tenureYear}Years ${this.personalLoanDetailsForm.value.tenureMonths} months ${this.personalLoanDetailsForm.value.tenureDay} Days`,
    });
    sessionStorage.setItem("loanAmmount", loanAmmount);
    sessionStorage.setItem(
      "loanHolderType",
      this.personalLoanDetailsForm.value.holderType
    );
    this.loanApi.submitLoanDetail(this.calculatePayload()).subscribe((resp) => {
      if (resp?.statusCode === 201) {
        this.snack.open(`Create Loan Details Saved` + " !", "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
        });
        sessionStorage.setItem("loanDisburseId", resp.data.id);
        this.onSaveCreateLoan.emit(this.personalLoanDetailsForm);
      }
    });
  }
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
      this.personalLoanDetailsForm.value?.disbursementType
        .toLowerCase()
        .includes("account") &&
      this.personalLoanDetailsForm.value?.accountType === "external"
    ) {
      payload.otherAccNo = this.personalLoanDetailsForm.value.accountNumber;
      payload.accountNumber = null;
      payload.external = true;
    } else {
      payload.otherAccNo = "";
      payload.accountNumber = this.personalLoanDetailsForm.value.accountNumber;
      payload.external = false;
    }
    return payload;
  }

  onExit() {
    this.router.navigate(["loan/landing"]);
  }
  editRecord() {
    this.isReadOnly = false;
  }
}
