import { Component } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';

@Component({
  selector: 'app-create-account-landing-page',
  templateUrl: './create-account-landing-page.component.html',
  styleUrls: ['./create-account-landing-page.component.scss']
})
export class CreateAccountLandingPageComponent {

  selectedPhoneCode: string = '+91'
  displaySecond: any;
  showOTPSection: boolean;
  phone: any;
  otp: any;
  resendLink: boolean = false;
  otpDigit1: string = '';
  otpDigit2: string = '';
  otpDigit3: string = '';
  otpDigit4: string = '';
  otpDigit5: string = '';
  otpDigit6: string = '';
  agreed: boolean = false;
  accountHeader: string | any;
  isMobileVerificationTab: boolean = true;
  isPersonalDetailsTab: boolean;
  isSelectKYCTab: boolean;
  stepper: MatStepper

  constructor(private router: Router,
    private openAccountService: OpenAccountService,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.accountHeader = this.activeRoute.snapshot['queryParams']['title'];
    commonService.updateData(router.url);
  }

  ngOnInit(): void {

  }

  onVerify() {
    this.isPersonalDetailsTab = true;
    this.isMobileVerificationTab = false;
    this.isSelectKYCTab = false;
    this.stepper.next();
  }

  onExit() {
    this.router.navigate(['/']);
  }

  getTabDetails(tabDetails: any) {
    if (tabDetails) {
      this.isMobileVerificationTab = tabDetails.isMobileVerification;
      this.isPersonalDetailsTab = tabDetails.isPersonalDetails;
      this.isSelectKYCTab = tabDetails.isSelectKYC;
      this.stepper = tabDetails.stepper;
    }
  }

  personalDetailsSubmitted() {
    this.isPersonalDetailsTab = false;
    this.isMobileVerificationTab = false;
    this.isSelectKYCTab = true;
    this.stepper.next();
  }

  onBackOnPreviousStep() {
    this.stepper.previous();
  }

}
