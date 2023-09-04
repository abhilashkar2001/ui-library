import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
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
  isFixedDepositDetail: boolean = false; // should be true
  isPersonalDetails: boolean = false;
  isBookFd: boolean = false;
  isVerifyNumber: boolean = false;
  @ViewChild("stepper") stepper;
  selectedStep: number = 0;
  customBasicForm: any;
  isLinear = true;
  steper_Array: any[] = [];
  cuurrentStep = "Create FD";
  constructor(
    private fb: FormBuilder,
    private depositApi: NewDepositService,
    private fdApi: FdCalculatorServiceService,
    private snack: MatSnackBar,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.buildCreateFdForm();
    console.log(this.customVerifyNumber);
    var sessionStep = parseInt(sessionStorage.getItem("selectedStep"));
    if (sessionStep) this.selectedStep = sessionStep;
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
        label: "Kyc",
      },
      {
        id: 5,
        stepFormControl: this.personalDetailsForm,
        label: "Book Fd",
      },
    ];
    this.factory();
    var depositId = parseInt(sessionStorage.getItem("fixedDepositId"));
    if (depositId) {
      this.getFdById(depositId);
    } else {
      this.buildCreateFdForm();
    }
  }
  getFdById(id) {
    this.fdApi.getFixedDeposit(parseInt(id)).subscribe((resp) => {
      if (resp?.statusCode === 201) this.buildCreateFdForm(resp.data[0]);
      else this.buildCreateFdForm();
    });
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
  }

  buildCreateFdForm(data?) {
    this.createFdForm = this.fb.group({
      amount: [data ? data?.amount : "", Validators.required],
      maturityDate: [data ? data?.maturityDate : "", Validators.required],
      intrestRate: [data ? data?.intrestRate : "", Validators.required],
      tenureYear: [data ? data?.tenureYear : ""],
      tenureMonth: [data ? data?.tenureMonth : ""],
      tenureDays: [data ? data?.tenureDays : ""],
      ownerShip: [data ? data?.ownerShip : "", Validators.required],
      maturityAmount: [data ? data?.maturityAmount : "", Validators.required],
      typeOfCustomer: [data ? data?.typeOfCustomer : "", Validators.required],
      intrestPayout: [data ? data?.intrestPayout : "", Validators.required],
      paymentType: [data ? data?.paymentType : "", Validators.required],
      autoRenew: false,
      fixedDepositId: data && data.fixedDepositId,
    });
    this.customBasicForm = this.createFdForm;
  }
  cancel() {
    window.close();
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
        this.next();
        sessionStorage.setItem("selectedStep", "1");
        this.isFixedDepositDetail = false;
        this.isVerifyNumber = true;
      }
    });
  }
  submitPersonalDetails(event) {
    console.log(event);
    this.fdApi.submitFdPersonal(event.personalDetails).subscribe((resp) => {
      this.snack.open(`Personal Details Saved` + " !", "OK", {
        duration: 4000,
        verticalPosition: "top",
        horizontalPosition: "right",
        panelClass: "snackbar-error",
      });
      this.next();
    });
  }

  customSaveVerify(e) {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    this.factory();
    sessionStorage.setItem("selectedStep", "2");
    this.isVerifyNumber = false;
    this.isPersonalDetails = true;
    this.cdref.detectChanges();
  }

  goBack() {
    const num = this.selectedStep - 1;
    this.selectedStep = num;
    this.factory();
  }
  next() {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    this.factory();
    // for scrolling sidebar and get current state.
    const el = document.querySelector(".mat-step-label-selected");
    el.scrollIntoView();
  }
  customFormGroup(e) {
    this.personalDetailsForm = e;
  }
  customFormGroupEmit(event) {
    this.steper_Array[1].stepFormControl = event;
  }
  onHolderTypeChange(e) {
    console.log(e);
    sessionStorage.setItem("holderType", e);
  }

  factory() {
    this.cuurrentStep = this.steper_Array[this.selectedStep].label;
  }
  customSaveDocuments(e) {
    var docIds = [];
    e.documentDetails.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });

    var payload = {
      customerId: 10056,
      documentInfo: docIds,
    };
    this.depositApi.submitAllDocument(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.next();
      }
    });
    console.log(docIds);
  }
  customDocumentForm(e) {}

  submitDocument() {}
}
