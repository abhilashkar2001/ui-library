import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionStorageEnum } from "app/enum/session-storage.enum";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { OriginationService } from "app/shared/services/origination.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import * as moment from "moment";

@Component({
  selector: "app-dob-verification",
  templateUrl: "./dob-verification.component.html",
  styleUrls: ["./dob-verification.component.scss"],
})
export class DobVerificationComponent implements OnInit {
  dateOfBirth: string;
  showOTP: boolean = false;
  originationId: number;
  otpSent: boolean = false;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: "",
  };
  otp: any;
  customerInfo: any;
  incorrectDOB: boolean = false;
  constructor(
    private originationService: OriginationService,
    private sessionStorageService: SessionStorageService,
    private loginService: OpenAccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.originationId = this.sessionStorageService.getOriginationId() || 3507;
  }

  validateDateOfBirth() {
    if (this.showOTP) return;
    this.originationService
      .validateDateOfBirth(this.originationId, this.dateOfBirth)
      .subscribe((res: IcHttpResponseModel) => {
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
    const type = JSON.parse(sessionStorage.getItem(SessionStorageEnum.TYPE));
    this.loginService
      .verifyOtp({
        mobile: this.sessionStorageService?.getCustomerInfo()?.contact?.mobile,
        otp: this.otp,
      })
      .subscribe(async (res: any) => {
        if (type == "send-link")
          this.router.navigate(["origination/checklist-document"]);
        else if (type == "e-sign") {
          if (this.customerInfo?.catagory == "Lending")
            this.router.navigate(["origination/offer-letter"]);
          else this.router.navigate(["origination/digital-sign"]);
        }
      });
  }

  onOtpChange(otp) {
    this.otp = otp;
  }
}
