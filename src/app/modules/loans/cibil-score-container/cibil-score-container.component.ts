import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ReusableAlertPopupComponent } from "app/shared/components/reusable-alert-popup/reusable-alert-popup.component";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-cibil-score-container",
  templateUrl: "./cibil-score-container.component.html",
  styleUrls: ["./cibil-score-container.component.scss"],
})
export class CibilScoreContainerComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() isDifferentMobileNumber: EventEmitter<any> = new EventEmitter();
  @Output() onCustomSubmit = new EventEmitter<any>();
  @Input("updateParentModel") updateParentModel: (value: Partial<any>) => void;
  @Input() createLoanAccountNumber;
  hideInfo: boolean = true;

  isDifferentMobile: boolean = false;
  showCibilScoreResult: boolean = true;
  selectedOption: "different" | "same" = "same";
  optionalSteps: any;
  phone: any;
  showOtpSection: boolean;
  otpSent: boolean = false;
  invalidOtp: boolean = false;
  otp: any;
  agreed: boolean = false;
  isOtpAllowed: boolean = false;

  constructor(
    private commonService: CommonService,
    private openAccountService: OpenAccountService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.customerConsent();
  }

  customerConsent() {
    const dialogRef = this.dialog.open(ReusableAlertPopupComponent, {
      data: {
        msg: "Can I use the same verified number to check the credit bureau",
      },
      width: "750px",
      height: "400px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.showCibilScoreResult = true;
      } else {
        this.showCibilScoreResult = false;
        this.selectedOption = "different";
      }
    });
  }

  onBack() {
    this.onBackEvent.emit();
  }

  radioChange(event: any) {
    this.isDifferentMobile = event.value === "same" ? false : true;
    this.commonService.isUserUsingDifferentMobile(this.isDifferentMobile);
    let tempRow = [
      { stepName: "Personal Details" },
      { stepName: "Select KYC" },
    ];
    this.isDifferentMobile
      ? this.isDifferentMobileNumber.emit({
          steps: tempRow,
          isDifferentMobile: true,
        })
      : this.isDifferentMobileNumber.emit({
          steps: [],
          isDifferentMobile: false,
        });
  }

  onBackCIBILScoreResult(event: any) {
    this.showCibilScoreResult = false;
  }

  onContinue() {
    if (this.selectedOption === "different") {
      this.openAccountService
        .verifyOtp({ mobile: this.phone, otp: this.otp })
        .subscribe((response: any) => {
          if (response.statusCode === 401) {
            this.showCibilScoreResult = false;
            this.invalidOtp = true;
          } else if (response.statusCode === 200) {
            this.invalidOtp = false;
            this.showCibilScoreResult = true;
          }
        });
    } else this.showCibilScoreResult = true;
  }

  onConfirmFromCibilScoreResult() {
    this.updateParentModel({ updateMasterSave: false });
    this.onCustomSubmit.emit();
  }

  onVerify() {
    this.onConfirmEvent.emit();
  }

  getOTP(event: any) {
    this.phone = event.phone;
    sessionStorage.setItem("loanPhone", this.phone);
    this.showOtpSection = true;
    this.openAccountService.getOtp(this.phone).subscribe((response: any) => {
      this.otpSent = true;
      setTimeout(() => {
        this.otpSent = false;
      }, 5000);
    });
  }

  checkCobilConfim() {
    if (this.selectedOption === "same") return false;
    else {
      if (!(this.isOtpAllowed && this.agreed)) return true;
      else return false;
    }
  }
  enteredOtp(event: any) {
    this.otp = event.otp;
    this.agreed = event?.agreed;
    this.isOtpAllowed = this.otp && this.otp?.length >= 6 ? true : false;
  }

  otpTimer(event) {
    if (event.seconds == "00:00") {
      this.isOtpAllowed = false;
    }
  }
}
