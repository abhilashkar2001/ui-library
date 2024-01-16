import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CommonService } from "app/shared/services/common-service/common.service";
import { debounceTime } from "rxjs/operators";

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

  constructor(private fb: FormBuilder, private commonService: CommonService) {
    this.buildFormGroup();
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  onGetOTP() {
    this.getOTP.emit({ phone: this.otpForm.value.phone });
    this.getOtpBtn = true;
    this.validNumber = true;
    this.resendLink = false;
    this.otpTimer();
  }

  otpChange() {}

  loadCountries() {
    this.commonService.getAllCountries().subscribe(
      (resp: any) => {
        if (resp?.data) {
          this.countriesIsdCodes = resp?.data.map((i) => i?.countryTelIsdCode);
          this.selectedIsdCode = this.countriesIsdCodes[0];
        }
      },
      (err) => console.error("Error: ", err)
    );
  }

  onOtpChange(otp) {
    console.log(otp);
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
      phone: [],
    });
    this.otpForm
      .get("phone")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        if (resp?.length == 10) {
          this.validNumber = false;
        } else {
          this.validNumber = true;
        }
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
