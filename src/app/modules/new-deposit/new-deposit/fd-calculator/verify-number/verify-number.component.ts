import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NewDepositService } from "../../../new-deposit.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { SuccessPopupComponent } from "../success-popup/success-popup.component";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-verify-number",
  templateUrl: "./verify-number.component.html",
  styleUrls: ["./verify-number.component.scss"]
})
export class VerifyNumberComponent implements OnInit {
  @Output() customSaveVerify = new EventEmitter<{}>();
  @Output() customFormGroupEmit = new EventEmitter<{}>();
  @Output() customVerifyBack = new EventEmitter<{}>();
  @Output() customExistingData = new EventEmitter<{}>();
  dialogRef: MatDialogRef<SuccessPopupComponent> | any;
  verifyNumFirm!: FormGroup;
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
      height: "50px"
    }
  };
  isChecked: boolean = false;
  yourOtp: any = "";
  display: any;
  phone: any;

  constructor(
    private fb: FormBuilder,
    private api: NewDepositService,
    private snack: MatSnackBar,
    private openAccountService: OpenAccountService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildVerifyNumForm();
    setTimeout(() => {
      this.customFormGroupEmit.emit(this.verifyNumFirm);
    }, 200);
  }
  onOtpChange(e: any) {
    this.yourOtp = e.toString();
  }

  buildVerifyNumForm() {
    this.verifyNumFirm = this.fb.group({
      verifyMobile: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ])
      ]
    });
    this.customFormGroupEmit.emit(this.verifyNumFirm);
  }

  verify() {
    const payload = {
      mobile: this.verifyNumFirm.value.verifyMobile,
      otp: this.yourOtp
    };
    this.api.verifyOtp(payload).subscribe((resp) => {
      if (resp?.statusCode == 200 || resp) {
        this.snack.open(`Mobile Number verified successfully`, "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
          panelClass: "snackbar-error"
        });
        this.verifyCustomer();
      }
    });
  }

  verifyCustomer() {
    this.openAccountService
      .getExistingCustomer(this.verifyNumFirm.value.verifyMobile)
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200 && resp?.data) {
          this.customExistingData.emit({
            customerInfo: resp.data[0]
          });
          this.customSaveVerify.emit(true);
          // this.customFormGroupEmit.emit(this.verifyNumFirm);
        } else if (resp?.statusCode === 204) {
          this.customSaveVerify.emit(true);
          this.customFormGroupEmit.emit(this.verifyNumFirm);
        }
      });
  }

  getOtp() {
    this.api.getOtp(this.verifyNumFirm.value.verifyMobile).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        //  need to be replace bytoast service
        this.snack.open(`Otp sent successfully`, "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
          panelClass: "snackbar-error"
        });
        this.timer(1);
      }
    });
    this.isShowOtp = true;
  }

  timer(minute: any) {
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
