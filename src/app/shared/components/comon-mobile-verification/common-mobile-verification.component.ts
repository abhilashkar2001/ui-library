import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { identifierName } from "@angular/compiler";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CommonService } from "app/shared/services/common-service/common.service";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-common-mobile-verification",
  templateUrl: "./common-mobile-verification.component.html",
  styleUrls: ["./common-mobile-verification.component.scss"],
  animations: [
    trigger("fadeInOut", [
      state(
        "void",
        style({
          opacity: 0,
        })
      ),
      transition("void <=> *", animate(1000)),
    ]),
  ],
})
export class CommonMobileVerificationComponent implements OnInit {
  @Output() getOTP: EventEmitter<any> = new EventEmitter();
  @Output() enteredOTP: EventEmitter<any> = new EventEmitter();
  @Output() OTPTimer: EventEmitter<any> = new EventEmitter();
  @Input() showOtpSection: boolean;
  @Input() invalidOtp: boolean;
  @Input() otpSent: boolean;
  @Input() hideInfo = false;
  otpForm: FormGroup;
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
  validNumber: boolean = true;
  countriesIsdCodes: any = [];
  selectedIsdCode: any = "";
  isValidMobile: boolean = false;
  timer: NodeJS.Timer;
  selectedIsd: any;
  defaultIsdCodeValue: any;
  resendOtp: number = 0;
  maxMobileLength: number;

  constructor(private fb: FormBuilder, private commonService: CommonService) {
    this.buildFormGroup();
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.otpSent) {
      this.otpTimer();
    }
    if (changes.hideInfo) this.hideInfo = changes.hideInfo.currentValue;
  }

  onGetOTP() {
    this.getOTP.emit({ phone: this.otpForm.value.phone });
    this.getOtpBtn = true;
    this.validNumber = true;
    this.resendLink = false;
    this.resendOtp += 1;
    clearInterval(this.timer);
  }

  otpChange() {}

  loadCountries() {
    this.commonService.getAllCountries().subscribe(
      (resp: any) => {
        if (resp?.data) {
          this.countriesIsdCodes = resp?.data;
          const indiaIsdCode = this.countriesIsdCodes.find(
            (item) => item?.countryName.toLowerCase() == "india"
          );
          if (indiaIsdCode) {
            this.defaultIsdCodeValue = indiaIsdCode?.countryTelIsdCode;
            this.maxMobileLength = indiaIsdCode?.mobileLength;
          } else {
            this.defaultIsdCodeValue =
              this.countriesIsdCodes[0].countryTelIsdCode;
            this.maxMobileLength = this.countriesIsdCodes[0]?.mobileLength;
          }
        }
      },
      (err) => console.error("Error: ", err)
    );
  }

  onOtpChange(otp) {
    this.otp = otp;
    this.enteredOTP.emit({ otp: this.otp, agreed: this.agreed });
  }
  isValidated() {
    if (this.otpForm.value.phone?.length === 10 && this.getOtpBtn) {
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
      phone: [""],
      isdCode: [""],
    });
    this.otpForm
      .get("phone")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        const regExp = /^[0]+$/;
        if (resp?.length == this.maxMobileLength) {
          this.isValidMobile = regExp.test(resp);
          this.validNumber = false;
        } else {
          this.isValidMobile = false;
          this.validNumber = true;
          this.otpForm.get("phone").setErrors({ invalidLength: true });
        }
      });
  }

  otpTimer() {
    clearInterval(this.timer);
    let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;
    const prefix = minute < 10 ? "0" : "";
    this.timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.displaySecond = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.resendLink = true;
        clearInterval(this.timer);
      }
      this.OTPTimer.emit({ seconds: this.displaySecond });
    }, 1000);
  }
  onIsdCodeSelected(isdCode) {
    this.selectedIsd = isdCode;
  }
  setMobileLength() {
    if (this.otpForm.get("isdCode")) {
      const countryRecord = this.countriesIsdCodes.find(
        (item) => item.countryTelIsdCode == this.otpForm.get("isdCode").value
      );
      this.maxMobileLength = countryRecord.mobileLength;
    }
  }
}
