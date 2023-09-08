import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { NewDepositService } from "../../new-deposit.service";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-rd-calculator",
  templateUrl: "./rd-calculator.component.html",
  styleUrls: ["./rd-calculator.component.scss"],
})
export class RdCalculatorComponent implements OnInit {
  depositType = "RD";
  selectedStep = 0;
  isFixedDepositDetail: boolean = true; // should be true
  isPersonalDetails: boolean = false;
  isBookFd: boolean = false;
  isVerifyNumber: boolean = false;
  isKyc: boolean = false;
  @Input() customBasicForm: FormGroup;
  personalDetailsForm: FormGroup;
  documentDetailsForm: FormGroup;
  kycDetailsForm: FormGroup;
  rdDetailsForm: FormGroup;

  steper_Array = [];
  isLinear: boolean = true;
  cuurrentStep = "Create RD";

  constructor(
    private showSideBar: NewDepositService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.showSideBar.setToken(true);
    // var sessionStep = parseInt(sessionStorage.getItem("selectedStep"));
    //if (sessionStep) this.selectedStep = sessionStep;
    this.steper_Array = [
      {
        id: 1,
        stepFormControl: this.customBasicForm,
        label: "Create RD",
      },
      {
        id: 2,
        stepFormControl: this.documentDetailsForm,
        label: "Verify Mobile Number",
      },
      {
        id: 3,
        stepFormControl: this.personalDetailsForm,
        label: "Personal Details",
      },
      {
        id: 4,
        stepFormControl: this.kycDetailsForm,
        label: "Select KYC",
      },
      {
        id: 5,
        stepFormControl: this.rdDetailsForm,
        label: "Book RD",
      },
    ];
    this.factory();
  }
  factory() {
    this.cuurrentStep = this.steper_Array[this.selectedStep].label;
  }

  stepperSelectionChange(event) {}

  submitPersonalDetails(event) {
    // this.updateSelectedIndex();
    // this.isPersonalDetails = false;
    // this.isKyc = true;
    this.next();
    this.cdref.detectChanges();
  }
  customSaveDocuments(event) {
    // this.updateSelectedIndex();
    // this.isKyc = false;
    // this.isBookFd = true;
    this.next();
    this.cdref.detectChanges();
  }
  customSaveRD(event) {
    this.next();
    this.cdref.detectChanges();
  }

  customSaveVerify(e) {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    this.factory();
    //sessionStorage.setItem("selectedStep", "2");
    this.cdref.detectChanges();
  }
  goBack() {
    this.isFixedDepositDetail = true;
    this.isPersonalDetails = false;
  }

  next() {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    this.factory();
    // for scrolling sidebar and get current state.
    const el = document.querySelector(".mat-step-label-selected");
    el.scrollIntoView();
  }

  customSaveCreate(event) {
    console.log(event);
    // this.updateSelectedIndex();
    // this.isFixedDepositDetail = false;
    // this.isVerifyNumber = true;
  }

  updateSelectedIndex() {
    this.selectedStep = this.selectedStep + 1;
  }

  customFormGroup(e) {
    this.personalDetailsForm = e;
  }
  customDocumentForm(event) {
    console.log(event);
    this.documentDetailsForm = event;
  }
  // kycForm(event) {
  //   console.log(event);
  //   this.kycDetailsForm = event;
  // }
  rdForm(event) {
    console.log(event);
    this.rdDetailsForm = event;
  }
  // for verify number
  customFormGroupEmit(event) {
    this.steper_Array[1].stepFormControl = event;
  }
  customCreatRdForm(event) {
    this.steper_Array[0].stepFormControl = event;
    this.next();
    this.cdref.detectChanges();
  }
  customkycFormGroupEmit(event) {
    this.steper_Array[4].stepFormControl = event;
  }
  customrdFormGroupEmit(event) {
    this.steper_Array[5].stepFormControl = event;
  }
}
