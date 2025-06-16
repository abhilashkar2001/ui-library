import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { PrimaryCustomerInfo } from 'app/shared/models/primary-customer.model';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { OriginationService } from 'app/shared/services/origination.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-dob-verification',
  templateUrl: './dob-verification.component.html',
  styleUrls: ['./dob-verification.component.scss'],
})
export class DobVerificationComponent implements OnInit {
  dateOfBirth: string | any;
  showOTP = false;
  originationId: number | any;
  otpSent = false;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
  };
  otp: any;
  customerInfo: any;
  incorrectDOB = false;

  constructor(
    private originationService: OriginationService,
    private sessionStorageService: SessionStorageService,
    private loginService: OpenAccountService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId() || 3507;
  }

  validateDateOfBirth() {
    if (this.showOTP) return;
    this.originationService
      .validateDateOfBirth(this.originationId, this.dateOfBirth)
      .subscribe((res: IcHttpResponseModel<PrimaryCustomerInfo>) => {
        if (res?.statusCode === 200 && res?.data) {
          this.customerInfo = res?.data;
          this.sessionStorageService.setCustomerInfo(this.customerInfo);
          this.showOTP = true;
          this.sendOTPtoMobile();
          this.incorrectDOB = false;
        } else if (res?.statusCode == 204) this.incorrectDOB = true;
      });
  }

  sendOTPtoMobile() {
    this.loginService
      .getOtp(this.customerInfo?.contact?.mobile)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.otpSent = true;
        }
      });
  }

  verifyOtp() {
    const type = this.sessionStorageService.getType();
    this.loginService
      .verifyOtp({
        mobile: this.sessionStorageService?.getCustomerInfo()?.contact?.mobile,
        otp: this.otp,
      })
      .subscribe(async () => {
        if (type == 'send-link')
          this.router.navigate([
            'origination/request-processing/checklist-document',
          ]);
        else if (type == 'e-sign') {
          if (this.customerInfo?.catagory == 'Lending')
            this.router.navigate(['origination/request-process/offer-letter']);
          else
            this.router.navigate(['origination/request-process/digital-sign']);
        }
      });
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }
}
