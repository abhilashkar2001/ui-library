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
import * as moment from "moment";

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

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private loanApi: LoanService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.getGenericDetails();
    this.route.queryParamMap.subscribe((params: any) => {
      var id = parseInt(params.get("id"));
      if (id) this.getLoanById(id);
      else this.initialForm();
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
    this.personalLoanDetailsForm = this.fb.group({
      loanAmount: [data ? data?.emiAmount : "", Validators.required],
      tenureYear: [data ? data?.tenureYear : ""],
      tenureMonths: [data ? data?.tenureYear : ""],
      tenureDay: [data ? data?.tenureYear : ""],
      emiStartDate: [data ? data?.emiStartDate : "", Validators.required],
      emiAmount: [data ? data?.emiAmount : "", [Validators.required]],
      interestRate: [data ? data.interestRate : "", Validators.required],
      interestPayable: [data ? data.interestPayable : "", Validators.required],
      principlAmount: [data ? data.principalAmount : "", Validators.required],
      holderType: [data ? data?.tenureYear : "", Validators.required],
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
    });
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
    if (this.personalLoanDetailsForm.invalid) {
      return;
    }
    const loanAmmount = JSON.stringify({
      loanAmount: this.personalLoanDetailsForm.value.loanAmount || 20000,
      loanTenure: `${this.personalLoanDetailsForm.value.tenureYear}Years ${this.personalLoanDetailsForm.value.tenureMonths} months ${this.personalLoanDetailsForm.value.tenureDay} Days`,
    });
    sessionStorage.setItem("loanAmmount", loanAmmount);
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
      accountNumber: this.personalLoanDetailsForm.value.accountNumber,
      emiStartDate: moment(
        this.personalLoanDetailsForm.value.emiStartDate
      ).format(),
    };
    if (this.personalLoanDetailsForm.value?.id) {
      payload.id = this.personalLoanDetailsForm.value?.id;
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
