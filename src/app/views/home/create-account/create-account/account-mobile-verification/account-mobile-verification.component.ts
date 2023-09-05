import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import * as moment from "moment";

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
      .verifyOtp({ mobile: this.phone, otp: this.yourOtp })
      .subscribe((response) => {
        this.verifyCustomer();
      });
  }

  verifyCustomer() {
    this.openAccountService
      .getExistingCustomer(this.phone)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp?.statusCode === 200 && resp?.data) {
          const sessionData = JSON.parse(
            sessionStorage.getItem("basisDetails")
          );
          const payload = {
            originationModel: {
              applicationDate: moment(new Date()).format("YYYY-MMM-DD"),
              accountType: sessionData.accountType,
              basisDetailsId: sessionData.basisDetailsId,
              branchCode: "BR1",
            },
            customerInfo: resp.data,
          };
          this.openAccountService
            .saveCustomerInfo(payload)
            .subscribe((resp) => {
              // call success popup instead of routing.
              this.router.navigate(["account/landing"]);
            });
        } else if (resp?.statusCode === 204) {
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
    if (this.phone && this.phone.length === 10) {
      return false;
    }

    return true;
  }

  onExit() {
    this.router.navigate(["/"]);
  }
}
