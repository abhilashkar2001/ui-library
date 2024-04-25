import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { debounceTime } from "rxjs/operators";
import { ErrorNotifierPopupComponent } from "../error-notifier-popup/error-notifier-popup.component";
import { MatDialog } from "@angular/material/dialog";

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
  @Output() onCustomSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Input() showOtpSection: boolean;
  @Input() invalidOtp: boolean;
  @Input() otpSent: boolean;
  @Input() hideInfo = false;
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;
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
  selectedIsd: any;
  defaultIsdCodeValue: any;
  resendOtp: number = 0;
  maxMobileLength: number;
  intervalId: any;
  otpAvailable: boolean = false;
  yourOtp: any;
  // SAVE BUTTON PROPERTIES
  @Input() isLoading: boolean = false;
  @Input() basisName: string = "";
  loadingBtnText: string = "Saving...";
  @Input() mobileVerifyInfo: any = {};

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private api: OpenAccountService,
    private dialog: MatDialog
  ) {
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
    this.api.getOtp(this.otpForm.value.phone).subscribe((response: any) => {
      this.otpSent = true;
      this.showOtpSection = true;
      setTimeout(() => {
        this.otpSent = false;
      }, 5000);
    });
    this.getOtpBtn = true;
    this.validNumber = true;
    this.resendLink = false;
    this.invalidOtp = false;
    this.resendOtp += 1;
    this.stopInterval();
    this.otpTimer();
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
    this.yourOtp = this.otp.toString();
    this.otpAvailable =
      this.yourOtp && this.yourOtp?.length >= 6 ? true : false;
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
    this.stopInterval();
    let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;
    const prefix = minute < 10 ? "0" : "";
    this.intervalId = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.displaySecond = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.resendLink = true;
        this.stopInterval();
      }
      this.otpTimerReset({ seconds: this.displaySecond });
    }, 1000);
  }

  otpTimerReset(event) {
    if (event.seconds == "00:00") {
      this.isLoading = false;
      this.otpAvailable = false;
    }
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

  /**
   * TO clear the timer interval.
   */
  stopInterval() {
    clearInterval(this.intervalId);
  }

  onVerify() {
    this.isLoading = true;
    this.loadingBtnText = "Saving...";
    this.api
      .verifyOtp({ mobile: this.otpForm.value.phone, otp: this.yourOtp })
      .subscribe((response: any) => {
        if (response.statusCode === 401) {
          this.invalidOtp = true;
          this.isLoading = false;
        } else if (response.statusCode === 200 || response?.accessToken) {
          this.loadingBtnText = "Saved";
          this.isLoading = false;
          this.invalidOtp = false;
          this.onVerifyExistingProduct({ phone: this.otpForm.value.phone });
          // this.onCustomSubmit.emit({ phone: this.otpForm.value.phone });
        }
      });
  }

  onExit() {
    this.onBackEvent.emit();
  }

  onVerifyExistingProduct(event) {
    // this.isLoading = true;
    this.api
      .checkMobileAndProduct(
        this.mobileVerifyInfo.basisName,
        event.phone,
        this.mobileVerifyInfo.productDuplicationKey
      )
      .subscribe((resp) => {
        if (!resp) {
          this.allreadyProduct();
        } else {
          this.api.getExistingCustomer(event.phone).subscribe((resp: any) => {
            // Here cleaning the all ids from cache.
            this.cleanCacheInMobileScreen();
            if (resp?.statusCode === 200 && resp?.data) {
              if (resp?.data?.length > 0) {
                sessionStorage.setItem("mobileNo", event.phone);

                if (
                  this.mobileVerifyInfo.applicationType === "loan application"
                ) {
                  let customerIds: any[] = [];
                  resp.data.forEach((element) => {
                    customerIds.push(element.customerId);
                  });
                  sessionStorage.setItem(
                    "userCustomerId",
                    JSON.stringify(customerIds)
                  );
                } else {
                  sessionStorage.setItem(
                    "userCustomerId",
                    resp.data[0].customerId
                  );
                }
                this.onCustomSubmit.emit({ personalInfo: resp.data });
                this?.updateParentModel({
                  personalInfo: resp.data,
                  updateMasterSave: false,
                });
              }
            } else if (resp?.statusCode === 204) {
              this.onCustomSubmit.emit({
                personalInfo: resp.data,
              });
              this?.updateParentModel({
                personalInfo: resp.data,
                updateMasterSave: false,
              });

              sessionStorage.setItem("mobileNo", event.phone);
            } else {
              sessionStorage.setItem("mobileNo", event.phone);
            }
          });
        }
      });
  }
  allreadyProduct() {
    this.dialog.open(ErrorNotifierPopupComponent, {
      data: {
        errorMessage: `We have found similar ${this.mobileVerifyInfo.applicationType} in our record on your Mobile Number`,
        errorMessageHint: "Please visit bank for more information.",
      },
      width: "650px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
  }
  cleanCacheInMobileScreen() {
    sessionStorage.removeItem("userCustomerId");
    sessionStorage.removeItem("customerStageId");
    sessionStorage.removeItem("customerId");
    sessionStorage.removeItem("customerStageIds");
    sessionStorage.removeItem("originationId");
  }
}
