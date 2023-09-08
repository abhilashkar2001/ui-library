import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute } from "@angular/router";
import { loanStepperConstant } from "assets/json/loan-stepper.contant";

@Component({
  selector: "app-loan-stepper",
  templateUrl: "./loan-stepper.component.html",
  styleUrls: ["./loan-stepper.component.scss"],
})
export class LoanStepperComponent
  implements OnInit, OnChanges, AfterViewInit, AfterViewInit
{
  @Input() selectionIndex = 0;
  @Input() optionalSteps: any;
  @Input() accountHolderTYpe: string;
  @Output() customSelectionChange = new EventEmitter<{}>();
  @Input() existingUser: any;
  @ViewChild("stepper") private myStepper: MatStepper;

  loanstepper: any = loanStepperConstant;

  isLinear = true;
  stepperTitle: string;

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) {
    this.stepperTitle = activatedRoute.snapshot["queryParams"]["title"];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.optionalSteps &&
      this.optionalSteps.steps.length &&
      this.optionalSteps.isDifferentMobile
    ) {
      if (
        this.loanstepper.some(
          (step: { stepName: string }) => step.stepName === "Personal Details"
        )
      ) {
        this.loanstepper.splice(4, 0, { stepName: "Select KYC" });
      } else {
        this.loanstepper.splice(3, 0, ...this.optionalSteps.steps);
      }
    }

    if (
      this.accountHolderTYpe &&
      !this.optionalSteps &&
      !this.existingUser &&
      !this.existingUser.length
    ) {
      if (
        this.loanstepper &&
        !this.loanstepper.some(
          (step: { stepName: string }) => step.stepName === "Personal Details"
        )
      ) {
        this.loanstepper.splice(3, 0, { stepName: "Personal Details" });
      }
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.onStepSelectionChange();
  }

  onStepSelectionChange(e: any = { selectedIndex: 0 }) {
    let data = {};
    if (
      this.optionalSteps &&
      this.optionalSteps.steps.length &&
      this.optionalSteps.isDifferentMobile
    ) {
      switch (e.selectedIndex) {
        case 0:
          data = {
            isCreateLoanStep: true,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 1:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: true,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 2:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: true,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 3:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: true,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 4:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: true,
            stepper: this.myStepper,
          };
          break;
        case 5:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: true,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 6:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: true,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 7:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: true,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        default: {
        }
      }
    } else if (
      this.accountHolderTYpe &&
      !this.optionalSteps &&
      (this.accountHolderTYpe === "joint" ||
        this.accountHolderTYpe === "individual")
    ) {
      let isJointAccount = this.accountHolderTYpe === "joint" ? true : false;
      switch (e.selectedIndex) {
        case 0:
          data = {
            isCreateLoanStep: true,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            isJointAccount: isJointAccount,
            stepper: this.myStepper,
          };
          break;
        case 1:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: true,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            isJointAccount: isJointAccount,
            stepper: this.myStepper,
          };
          break;
        case 2:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: true,
            isSelectKYCStep: false,
            isJointAccount: isJointAccount,
            stepper: this.myStepper,
          };
          break;
        case 3:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: true,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            isJointAccount: isJointAccount,
            stepper: this.myStepper,
          };
          break;
        case 4:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: true,
            isCIBILScoreStep: false,
            isJointAccount: isJointAccount,
            stepper: this.myStepper,
          };
          break;
        case 5:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: true,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isJointAccount: isJointAccount,
            stepper: this.myStepper,
          };
          break;
        case 6:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: true,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            isJointAccount: isJointAccount,
            stepper: this.myStepper,
          };
          break;
        default: {
        }
      }
    } else {
      switch (e.selectedIndex) {
        case 0:
          data = {
            isCreateLoanStep: true,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 1:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: true,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 2:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: true,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 3:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: false,
            isDocumentStep: true,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 4:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: true,
            isloanSummaryStep: false,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        case 5:
          data = {
            isCreateLoanStep: false,
            isPersonalDetailsStep: false,
            isMobileVerificationStep: false,
            isTermsCondtionsStep: false,
            isloanSummaryStep: true,
            isDocumentStep: false,
            isCIBILScoreStep: false,
            isSelectKYCStep: false,
            stepper: this.myStepper,
          };
          break;
        default: {
        }
      }
    }
    this.customSelectionChange.emit(data);
  }
}
