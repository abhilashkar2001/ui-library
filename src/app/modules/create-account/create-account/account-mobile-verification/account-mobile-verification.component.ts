import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-account-Mobile-verification-details",
  templateUrl: "./account-mobile-verification.component.html",
  styleUrls: ["./account-mobile-verification.component.scss"],
})
export class AccountMobileVerificationComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onVerifyOtpEvent: EventEmitter<any> = new EventEmitter();
  dialogRef: MatDialogRef<SuccessPopupComponent>;
  selectedPhoneCode: string = "+91";
  displaySecond: string;
  showOTPSection: boolean;
  phone: any;
  resendLink: boolean = false;
  yourOtp: any = "";
  otpAvailable: boolean = false;
  agreed: boolean = false;
  accountHeader: string | any;
  getOtpBtn: boolean = true;
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
  invalidOtp: boolean = false;
  otpSent: boolean = false;
  otpForm: FormGroup;
  validNumber: boolean = true;
  // SAVE BUTTON PROPERTIES
  isLoading: boolean = false;
  loadingBtnText: string = "Saving...";

  constructor(
    private router: Router,
    private openAccountService: OpenAccountService,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    public dialog: MatDialog,
    public snack: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.accountHeader = this.activeRoute.snapshot["queryParams"]["title"];
    commonService.updateData(router.url);
  }

  ngOnInit(): void {}

  getOTP(event) {
    this.resendLink = false;
    this.getOtpBtn = true;
    this.validNumber = true;
    this.phone = event.phone;
    this.showOTPSection = true;
    this.openAccountService.getOtp(event.phone).subscribe((response: any) => {
      // this.snack.open(`Otp sent Successfully !`, "", {
      //   duration: 4000,
      //   verticalPosition: "top",
      //   horizontalPosition: "right",
      //   panelClass: "success",
      // });
      this.otpSent = true;
      setTimeout(() => {
        this.otpSent = false;
      }, 5000);
    });
  }

  otpTimer(event) {
    if (event.seconds == "00:00") {
      this.isLoading = false;
      this.otpAvailable = false;
    }
  }

  onVerify() {
    this.isLoading = true;
    this.loadingBtnText = "Saving...";
    this.openAccountService
      .verifyOtp({ mobile: this.phone, otp: this.yourOtp })
      .subscribe((response: any) => {
        if (response.statusCode === 401) {
          this.invalidOtp = true;
          this.isLoading = false;
        } else if (response.statusCode === 200) {
          this.loadingBtnText = "Saved";
          this.isLoading = false;
          this.invalidOtp = false;
          this.onVerifyOtpEvent.emit({ phone: this.phone });
          // this.verifyCustomer();
        }
      });
  }

  verifyCustomer() {
    this.openAccountService
      .getExistingCustomer(this.phone)
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200 && resp?.data) {
          if (resp?.data[0]?.kycStatus) {
            const sessionData = JSON.parse(
              localStorage.getItem("basisDetails")
            );
            sessionStorage.setItem("mobileNo", this.phone);
            sessionStorage.setItem("customerId", resp.data[0].customerId);
            this.onVerifyOtpEvent.emit();
          }
        } else if (resp?.statusCode === 204) {
          sessionStorage.setItem("mobileNo", this.phone);
          this.onVerifyOtpEvent.emit();
        } else {
          sessionStorage.setItem("mobileNo", this.phone);
          this.onVerifyOtpEvent.emit();
        }
      });
  }

  onOtpChange(event: any) {
    this.yourOtp = event.otp.toString();
    this.agreed = event?.agreed;
    this.otpAvailable =
      this.yourOtp && this.yourOtp?.length >= 6 ? true : false;
  }

  onExit() {
    this.router.navigate(["/"]);
  }
}
