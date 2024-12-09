import { Location } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-card-mobile-verification",
  templateUrl: "./card-mobile-verification.component.html",
  styleUrls: ["./card-mobile-verification.component.scss"]
})
export class CardMobileVerificationComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();

  phone: any;
  otp: any;
  showOtpSection: boolean | any;
  stepperTitle: string;

  constructor(
    private location: Location,
    private openAccountService: OpenAccountService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private router: Router
  ) {
    this.stepperTitle = this.activatedRoute.snapshot["queryParams"]["title"];
    this.commonService.updateData(this.router.url);
  }

  ngOnInit(): void {}

  getOTP(event: any) {
    this.phone = event.phone;
    this.openAccountService.getOtp(this.phone).subscribe(() => {
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
    this.location.back();
  }

  onVerify() {
    this.openAccountService
      .verifyOtp({ mobile: this.phone, otp: this.otp })
      .subscribe(() => {
        this.onConfirmEvent.emit();
      });
  }
}
