import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-common-mobile-verification",
  templateUrl: "./common-mobile-verification.component.html",
  styleUrls: ["./common-mobile-verification.component.scss"],
})
export class CommonMobileVerificationComponent implements OnInit {
  @Output() getOTP: EventEmitter<any> = new EventEmitter();
  @Output() enteredOTP: EventEmitter<any> = new EventEmitter();
  @Input() showOtpSection: boolean;

  selectedPhoneCode: string = "+91";
  phone: string;
  otp: any;
  agreed: boolean;
  resendLink: boolean;
  displaySecond: string;
  otpDigit1: string = "";
  otpDigit2: string = "";
  otpDigit3: string = "";
  otpDigit4: string = "";
  otpDigit5: string = "";
  otpDigit6: string = "";

  constructor() {}

  ngOnInit(): void {}

  onGetOTP() {
    this.getOTP.emit({ phone: this.phone });
    this.otpTimer();
  }

  otpChange() {
    this.otp =
      this.otpDigit1 +
      this.otpDigit2 +
      this.otpDigit3 +
      this.otpDigit4 +
      this.otpDigit5 +
      this.otpDigit6;
    this.enteredOTP.emit({ otp: this.otp });
  }

  isValidated() {
    if (this.phone && this.phone.length === 10) {
      return false;
    }
    return true;
  }

  otpTimer() {
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
}
