import { Location } from "@angular/common";
import {
  AfterViewInit,
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { LoanService } from "app/shared/services/loan/loan.service";

@Component({
  selector: "app-create-loan-landing-page",
  templateUrl: "./create-loan-landing-page.component.html",
  styleUrls: ["./create-loan-landing-page.component.scss"],
})
export class CreateLoanLandingPageComponent
  implements OnInit, OnChanges, AfterViewInit
{
  personalDetailsForm: FormGroup | any;
  stepperTitle: string;
  stepper: MatStepper;
  accountHolderTYpe: string;
  existingUser: any;
  stepsDetails: any = {
    isCreateLoanStep: true,
    isPersonalDetailsStep: false,
    isMobileVerification: false,
    isTermsCondtionsStep: false,
    isloanSummaryStep: false,
    isDocumentStep: false,
    isCIBILScoreStep: false,
    isSelectKYCStep: false,
  };
  optionalSteps: any;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private loanService: LoanService
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  getTabDetails(tabDetails: any) {
    if (tabDetails) {
      this.stepper = tabDetails.stepper;
      this.stepsDetails = tabDetails;
    }
  }

  addMoreSteps(newOptions: any) {
    this.optionalSteps = newOptions;
  }

  checkAccountHolderType(event: any) {
    this.accountHolderTYpe = event;
  }

  existingUserDetails(data: any) {
    this.existingUser = data;
    this.existingUser && this.getLoanPersonalDetails();
  }

  getLoanPersonalDetails() {
    let payload;
    this.commonService.$calculatorsData.subscribe((loanDetails) => {
      payload = {
        loanAccountInfo: {
          loanDetails,
          source: "website",
        },
        customerInfo: this.existingUser,
      };

      this.submitCustomerDetails(payload);
    });
  }

  submitCustomerDetails(payload: any) {
    this.loanService
      .saveLoanPersonaldetails(payload)
      .subscribe((response: any) => {
        console.log("Personal Details Submitted", response);
      });
  }

  onConfirm(event: any) {
    this.stepper.next();
  }

  onBack(event: any) {
    this.stepper.previous();
  }

  onExit() {
    this.location.back();
  }
}
