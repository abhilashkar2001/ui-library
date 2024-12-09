import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";

@Component({
  selector: "app-create-card-landing-page",
  templateUrl: "./create-card-landing-page.component.html",
  styleUrls: ["./create-card-landing-page.component.scss"]
})
export class CreateCardLandingPageComponent {
  personalDetailsForm: FormGroup | any;
  stepperTitle: string;
  stepper: MatStepper | any;
  stepsDetails: any = {
    isPersonalDetailsStep: false,
    isMobileVerification: true,
    isTermsCondtionsStep: false,
    isCIBILScoreStep: false,
    isSelectKYCStep: false
  };
  optionalSteps: any;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
    this.commonService.updateData(this.router.url);
  }

  ngOnInit(): void {}

  getTabDetails(tabDetails: any) {
    if (tabDetails) {
      this.stepper = tabDetails.stepper;
      this.stepsDetails = tabDetails;
    }
  }

  addMoreSteps(newOptions: any) {
    this.optionalSteps = newOptions;
  }

  onConfirm() {
    this.stepper.next();
  }

  onBack() {
    this.stepper.previous();
  }

  onExit() {
    this.location.back();
  }
}
