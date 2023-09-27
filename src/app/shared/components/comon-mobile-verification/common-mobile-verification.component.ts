import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-common-mobile-verification",
  templateUrl: "./common-mobile-verification.component.html",
  styleUrls: ["./common-mobile-verification.component.scss"],
})
export class CommonMobileVerificationComponent implements OnInit {
  @Output() getOTP: EventEmitter<any> = new EventEmitter();
  @Output() enteredOTP: EventEmitter<any> = new EventEmitter();
  @Input() showOtpSection: boolean;
  otpForm: FormGroup;
  selectedPhoneCode: string = "+91";
  phone: string;
  otp: any;
  agreed: boolean = false;
  resendLink: boolean;
  displaySecond: string;
  getOtpBtn: boolean = true;
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "80px",
      height: "80px",
    },
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onGetOTP() {
    this.getOTP.emit({ phone: this.phone });
    this.getOtpBtn = false;
    this.resendLink = false;
    this.otpTimer();
  }

  otpChange() {}

  onOtpChange(otp) {
    console.log(otp);
    this.otp = otp;
    this.enteredOTP.emit({ otp: this.otp, agreed: this.agreed });
  }
  isValidated() {
    if (this.phone?.length === 10 && this.getOtpBtn) {
      return false;
    }
    return true;
  }

  onAgreed() {
    this.agreed = !this.agreed;
    this.enteredOTP.emit({
      otp: this.otp,
      agreed: this.agreed,
    });
  }

  buildFormGroup() {
    this.otpForm = this.fb.group({
      otp: [],
    });
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
