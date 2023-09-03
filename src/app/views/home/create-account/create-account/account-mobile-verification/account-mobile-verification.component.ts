import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-account-Mobile-verification-details",
  templateUrl: "./account-mobile-verification.component.html",
  styleUrls: ["./account-mobile-verification.component.scss"],
})
export class AccountMobileVerificationComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onVerifyOtpEvent: EventEmitter<any> = new EventEmitter();
  selectedPhoneCode: string = "+91";
  displaySecond: any;
  showOTPSection: boolean;
  phone: any;
  otp: any;
  resendLink: boolean = false;
  otpDigit1: string = "";
  otpDigit2: string = "";
  otpDigit3: string = "";
  otpDigit4: string = "";
  otpDigit5: string = "";
  otpDigit6: string = "";
  agreed: boolean = false;
  accountHeader: string | any;

  constructor(
    private router: Router,
    private openAccountService: OpenAccountService,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.accountHeader = this.activeRoute.snapshot["queryParams"]["title"];
    commonService.updateData(router.url);
  }

  ngOnInit(): void {}

  getOTP() {
    this.resendLink = false;
    this.openAccountService.getOtp(this.phone).subscribe((response: any) => {
      this.showOTPSection = true;
      this.timer();
    });
  }

  onVerify() {
    this.openAccountService
      .verifyOtp({ mobile: this.phone, otp: this.otp })
      .subscribe((response) => {
        this.onVerifyOtpEvent.emit();
      });
  }

  timer() {
    let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;
    const prefix = minute < 10 ? "0" : "";
    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.displaySecond = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.resendLink = true;
        clearInterval(timer);
      }
    }, 1000);
  }

  otpChange() {
    this.otp =
      this.otpDigit1 +
      this.otpDigit2 +
      this.otpDigit3 +
      this.otpDigit4 +
      this.otpDigit5 +
      this.otpDigit6;
  }

  isValidated() {
    if (this.phone && this.phone.length === 10) {
      return false;
    }

    return true;
  }

  onExit() {
    this.router.navigate(["/"]);
  }
}
