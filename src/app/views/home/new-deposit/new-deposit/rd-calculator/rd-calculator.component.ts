import { Component, Input, OnInit } from "@angular/core";
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
  steper_Array = [];
  isLinear: boolean = true;

  constructor(private showSideBar: NewDepositService) {}

  ngOnInit(): void {
    this.showSideBar.setToken(true);
    this.steper_Array = [
      {
        id: 1,
        stepFormControl: this.customBasicForm,
        label: "Create FD",
      },
      {
        id: 2,
        stepFormControl: this.documentDetailsForm,
        label: "Document Details",
      },
      {
        id: 3,
        stepFormControl: this.personalDetailsForm,
        label: "Personal Details",
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

  submitPersonalDetails(event) {
    this.updateSelectedIndex();
    this.isPersonalDetails = false;
    this.isKyc = true;
  }
  customSaveDocuments(event) {
    this.updateSelectedIndex();
    this.isKyc = false;
    this.isBookFd = true;
  }
  customSaveVerify(e) {
    this.updateSelectedIndex();
    this.isVerifyNumber = false;
    this.isPersonalDetails = true;
  }
  goBack() {
    this.isFixedDepositDetail = true;
    this.isPersonalDetails = false;
  }
  customCreatRdForm(event) {
    this.customBasicForm = event;
  }
  customSaveCreate(event) {
    console.log(event);
    this.updateSelectedIndex();
    this.isFixedDepositDetail = false;
    this.isVerifyNumber = true;
  }

  updateSelectedIndex() {
    this.selectedStep = this.selectedStep + 1;
    console.log(this.selectedStep);
  }

  customFormGroup(e) {
    this.personalDetailsForm = e;
  }
  customDocumentForm(event) {
    console.log(event);
    this.documentDetailsForm = event;
  }
}
