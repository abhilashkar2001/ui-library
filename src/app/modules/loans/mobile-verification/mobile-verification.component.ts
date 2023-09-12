import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
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
    private loanService: LoanService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {}

  getOTP(event: any) {
    this.phone = event.phone;
    this.openAccountService.getOtp(this.phone).subscribe((response: any) => {
      this.snack.open(`Otp sent Successfully !`, "", {
        duration: 4000,
        verticalPosition: "top",
        horizontalPosition: "right",
        panelClass: "success",
      });
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
        this.checkExistingUserEvent.emit(response);
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
