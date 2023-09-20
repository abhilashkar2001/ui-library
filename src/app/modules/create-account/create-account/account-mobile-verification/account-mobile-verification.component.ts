import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { SharedService } from "app/shared/shared.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";

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
  displaySecond: any;
  showOTPSection: boolean;
  phone: any;
  otp: any;
  resendLink: boolean = false;
  yourOtp: any = "";
  agreed: boolean = false;
  accountHeader: string | any;
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
  isGetOtp: boolean = false;
  getOtpBtn: boolean = true;

  constructor(
    private router: Router,
    private openAccountService: OpenAccountService,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    public dialog: MatDialog,
    public snack: MatSnackBar, //  private sharedApi: SharedService //
    private tokenStore: TokenStorageService
  ) {
    this.accountHeader = this.activeRoute.snapshot["queryParams"]["title"];
    commonService.updateData(router.url);
  }

  ngOnInit(): void {}

  getOTP() {
    this.resendLink = false;
    this.getOtpBtn = false;
    this.openAccountService.getOtp(this.phone).subscribe((response: any) => {
      this.snack.open(`Otp sent Successfully !`, "", {
        duration: 4000,
        verticalPosition: "top",
        horizontalPosition: "right",
        panelClass: "success",
      });
      // this.sharedApi.showSuccess("Otp sent Successfully!", "Ok");
      this.showOTPSection = true;
      this.timer();
    });
  }

  onVerify() {
    this.openAccountService
      .verifyOtp({ mobile: this.phone, otp: this.yourOtp })
      .subscribe((response) => {
        this.verifyCustomer();
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
            const payload = {
              originationModel: {
                applicationDate: moment(new Date()).format("YYYY-MMM-DD"),
                accountType: sessionData.accountType,
                basisDetailsId: sessionData.basisDetailsId,
                branchCode: this.tokenStore.getUser().branchCode,
                source: "Web Site",
              },
              customerInfo: resp.data,
            };
            this.openAccountService
              .saveCustomerInfo(payload)
              .subscribe((response) => {
                if (response?.statusCode === 200) {
                  this.dialogRef = this.dialog.open(SuccessPopupComponent, {
                    data: {
                      originationId:
                        response.data.originationModel.originationId,
                    },
                    width: "750px",
                    disableClose: true,
                    panelClass: "popup-dialog-class",
                    backdropClass: "bdrop",
                  });
                }
              });
          } else {
            sessionStorage.setItem("mobileNo", this.phone);
            sessionStorage.setItem("customerId", resp.data[0].customerId);
            this.onVerifyOtpEvent.emit();
          }
        } else if (resp?.statusCode === 204) {
          sessionStorage.setItem("mobileNo", this.phone);
          this.onVerifyOtpEvent.emit();
        }
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

  onOtpChange(e) {
    console.log(e);
    this.yourOtp = e.toString();
    console.log(this.yourOtp);
  }

  isValidated() {
    if (this.phone?.length === 10 && this.getOtpBtn) {
      return false;
    }
    return true;
  }

  onExit() {
    this.router.navigate(["/"]);
  }
}
