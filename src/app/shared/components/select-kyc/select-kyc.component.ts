import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NewDepositService } from "app/views/home/new-deposit/new-deposit.service";

@Component({
  selector: "app-select-kyc",
  templateUrl: "./select-kyc.component.html",
  styleUrls: ["./select-kyc.component.scss"],
})
export class SelectKycComponent implements OnInit {
  @Output() customSaveVerify = new EventEmitter<{}>();
  @Output() customFormGroupEmit = new EventEmitter<{}>();
  @Output() customVerifyBack = new EventEmitter<{}>();
  kycForm: FormGroup;
  isShowOtp: boolean = false;
  isResend: boolean = false;
  otp: string = "";
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "50px",
      height: "50px",
    },
  };
  isChecked: boolean = false;
  yourOtp: any = "";
  display: any;
  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildKycForm();
    setTimeout(() => {
      this.customFormGroupEmit.emit(this.kycForm);
    }, 200);
  }
  onOtpChange(e) {
    console.log(e);
    this.yourOtp = e.toString();
    console.log(this.yourOtp);
  }

  buildKycForm() {
    this.kycForm = this.fb.group({
      verifyNationalID: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
      ],
    });
    this.customFormGroupEmit.emit(this.kycForm);
    console.log(this.kycForm);
  }

  verify() {
    const payload = {
      mobile: this.kycForm.value.verifyNationalID,
      otp: this.yourOtp,
    };
    // this.api.verifyOtp(payload).subscribe((resp) => {
    //   if (resp?.statusCode === 200) {
    //     this.snack.open(`Mobile Number verified successfully`, "OK", {
    //       duration: 4000,
    //       verticalPosition: "top",
    //       horizontalPosition: "right",
    //       panelClass: "snackbar-error",
    //     });
    //     this.customSaveVerify.emit(true);
    //     this.customFormGroupEmit.emit(this.kycForm);
    //   }
    // });
  }
  getOtp() {
    // this.api.getOtp(this.kycForm.value.verifyNationalID).subscribe((resp) => {
    //   if (resp?.statusCode === 200) {
    //     //  need to be replace bytoast service
    //     this.snack.open(`Otp sent successfully`, "OK", {
    //       duration: 4000,
    //       verticalPosition: "top",
    //       horizontalPosition: "right",
    //       panelClass: "snackbar-error",
    //     });
    //     this.timer(1);
    //   }
    // });
    this.isShowOtp = true;
  }

  timer(minute) {
    console.log(minute, ",");
    // let minute = 1;
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

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }

  goBack() {
    this.customVerifyBack.emit();
  }
}
