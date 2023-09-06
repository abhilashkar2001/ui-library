import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-mobile-verification",
  templateUrl: "./mobile-verification.component.html",
  styleUrls: ["./mobile-verification.component.scss"],
})
export class MobileVerificationComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() checkExistingUserEvent: EventEmitter<any> = new EventEmitter();

  selectedPhoneCode: string = "+91";
  phone: any;
  otp: any;
  showOtpSection: boolean;
  stepperTitle: string;

  constructor(
    private openAccountService: OpenAccountService,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {}

  getOTP(event: any) {
    this.phone = event.phone;
    this.openAccountService.getOtp(this.phone).subscribe((response: any) => {
      this.showOtpSection = true;
    });
  }

  enteredOtp(event: any) {
    this.otp = event.otp;
  }

  isValidated() {
    if (this.otp && this.otp >= 6) {
      return false;
    }
    return true;
  }

  onBack() {
    this.onBackEvent.emit();
  }

  getExistingUserDetails() {
    this.loanService
      .getExistingUserDetails(this.phone)
      .subscribe((response: any) => {
        console.log("Existing user: ", response);
        this.checkExistingUserEvent.emit(response.data);
        this.onConfirmEvent.emit();
      });
  }

  onVerify() {
    this.openAccountService
      .verifyOtp({ mobile: this.phone, otp: this.otp })
      .subscribe((response) => {
        this.getExistingUserDetails();
      });
  }
}
