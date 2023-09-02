import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NewDepositService } from "../../../new-deposit.service";
import { FdCalculatorServiceService } from "../fd-calculator-service.service";
import * as moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-fixed-deposit-details",
  templateUrl: "./fixed-deposit-details.component.html",
  styleUrls: ["./fixed-deposit-details.component.scss"],
})
export class FixedDepositDetailsComponent implements OnInit {
  createFdForm: FormGroup;
  personalDetailsForm: FormGroup;
  customVerifyNumber: FormGroup;
  isFixedDepositDetail: boolean = true; // should be true
  isPersonalDetails: boolean = false;
  isBookFd: boolean = false;
  isVerifyNumber: boolean = false;

  selectedStep: number = 0;
  customBasicForm: any;
  isLinear = true;
  steper_Array: any[] = [];
  constructor(
    private fb: FormBuilder,
    private depositApi: NewDepositService,
    private fdApi: FdCalculatorServiceService,
    private snack: MatSnackBar,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildCreateFdForm();
    console.log(this.customVerifyNumber);
    var sessionStep = parseInt(sessionStorage.getItem("selectedStep"));
    if (sessionStep) this.selectedStep = sessionStep;
    if (document.getElementById(".custom_stepper")) {
      document.getElementById(".custom_stepper").style.width = `${
        window.screen.width - 100
      }`;
    }
    this.steper_Array = [
      {
        id: 1,
        stepFormControl: this.createFdForm,
        label: "Create FD",
      },
      {
        id: 2,
        stepFormControl: this.customVerifyNumber,
        label: "Verify Mobile Number",
      },
      {
        id: 3,
        stepFormControl: this.personalDetailsForm,
        label: "Personal Details",
      },
      {
        id: 4,
        stepFormControl: this.personalDetailsForm,
        label: "Book Fd",
      },
    ];
  }
  onStepSelectionChange(e) {
    console.log(e);
    if (e.selectedStep.label == "Create FD") {
      this.isPersonalDetails = false;
      this.isBookFd = false;
      this.isFixedDepositDetail = true;
    } else if (e.selectedStep.label == "Verify Mobile Number") {
      this.isFixedDepositDetail = false;
      this.isVerifyNumber = true;
    } else if (e.selectedStep.label == "Personal Details") {
      this.isPersonalDetails = true;
      this.isVerifyNumber = false;
    } else {
      this.isPersonalDetails = false;
      this.isBookFd = true;
    }
  }

  stepperSelectionChange(e) {
    console.log(e);
  }

  customSelectionChange(event) {
    console.log(event);
    // this.isFixedDepositDetail = event.isFixedDepositDetail;
    // this.isPersonalDetails = event.isPersonalDetails;
    // this.isBookFd = event.isBookFd;
  }

  buildCreateFdForm() {
    this.createFdForm = this.fb.group({
      amount: ["", Validators.required],
      maturityDate: ["", Validators.required],
      intrestRate: ["", Validators.required],
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      ownerShip: ["", Validators.required],
      maturityAmount: ["", Validators.required],
      typeOfCustomer: ["", Validators.required],
      intrestPayout: ["", Validators.required],
      paymentType: ["", Validators.required],
      autoRenew: false,
    });
    this.customBasicForm = this.createFdForm;
    // this.customVerifyNumber = this.fb.group({
    //   verifyMobile: [
    //     "",
    //     Validators.compose([
    //       Validators.required,
    //       Validators.minLength(10),
    //       Validators.maxLength(10),
    //     ]),
    //   ],
    // });
  }
  submitCreateFd() {
    if (this.createFdForm.invalid) {
      return;
    }

    var payload = {};
    payload = {
      ...this.createFdForm.value,
      amount: parseInt(this.createFdForm.value.amount),
      maturityAmount: parseInt(this.createFdForm.value.maturityAmount),
      maturityDate: moment(this.createFdForm.value.maturityDate).format(
        "YYYY-MM-DD"
      ),
      intrestRate: parseInt(this.createFdForm.value.intrestRate),
      scheme: "Normal or Tax saver",
    };
    this.fdApi.submitFixedDetails(payload).subscribe((resp) => {
      if (resp?.statusCode === 201) {
        sessionStorage.setItem("fixedDepositId", resp.data.fixedDepositId);
        this.snack.open(`Fixed Deposit Details Saved` + " !", "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
          panelClass: "snackbar-error",
        });
        this.selectedStep = 1;
        sessionStorage.setItem("selectedStep", "1");
        this.isFixedDepositDetail = false;
        this.isVerifyNumber = true;
        //this.depositApi.serCreateFdDone(true);
      }
    });
  }
  submitPersonalDetails(event) {
    console.log(event);
    this.fdApi.submitFdPersonal(event.personalDetails).subscribe((resp) => {
      this.isPersonalDetails = false;
      this.isBookFd = true;
      this.selectedStep = this.selectedStep + 1;
    });
  }
  customSaveVerify(e) {
    console.log(e, "'''''''....................");
    this.selectedStep = 2;
    //   this.customVerifyNumber;
    sessionStorage.setItem("selectedStep", "2");
    this.isVerifyNumber = false;
    this.isPersonalDetails = true;
    this.cdref.detectChanges();
  }

  goBack() {
    this.isFixedDepositDetail = true;
    this.isPersonalDetails = false;
  }
  customFormGroup(e) {
    this.personalDetailsForm = e;
  }
  customFormGroupEmit(event) {
    //this.customVerifyNumber = event;

    this.steper_Array[1].stepFormControl = event;
  }
  onHolderTypeChange(e) {
    console.log(e);
    sessionStorage.setItem("holderType", e);
  }
}
