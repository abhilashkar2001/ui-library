import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TrackingService } from "../tracking-service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signin-track",
  templateUrl: "./signin-track.component.html",
  styleUrls: ["./signin-track.component.scss"]
})
export class SigninTrackComponent implements OnInit {
  screenTitle = "Tracking Status";
  selectedStep = 0;
  screenList = [
    {
      screenCode: 17717,
      screenName: "Application No/ Mobile No.",
      route: null,
      fileUrl: null,
      sequence: 1
    },
    {
      screenCode: 17720,
      screenName: "OTP Verification",
      route: null,
      fileUrl: null,
      sequence: 3
    },
    {
      screenCode: 17723,
      screenName: "Tracking Status",
      route: null,
      fileUrl: null,
      sequence: 2
    }
  ];

  isShowOtpField: boolean = false;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "70px",
      height: "70px"
    }
  };
  otp: any;
  yourOtp: any;
  otpAvailable: boolean = false;
  invalidOtp: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: TrackingService,
    private route: Router
  ) {}

  signForm!: FormGroup;

  ngOnInit(): void {
    this.signForm = this.fb.group({
      mobile: ""
      // otp: "",
    });
  }

  onOtpChange(otp: any) {
    this.otp = otp;
    this.yourOtp = this.otp.toString();
    this.otpAvailable =
      this.yourOtp && this.yourOtp?.length >= 6 ? true : false;
  }
  getOtp() {
    this.api.getOtp(this.signForm.value.mobile).subscribe(() => {
      this.isShowOtpField = true;
      this.selectedStep = 1;
    });
  }

  verifyOtp() {
    this.api
      .verifyOtp({
        mobile: this.signForm.value.mobile,
        otp: this.yourOtp
      })
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.invalidOtp = false;
          sessionStorage.setItem("trackingMobile", this.signForm.value.mobile);
          this.route.navigate(["/tracking/summary"]);
        } else if (resp?.statusCode === 401) {
          this.invalidOtp = true;
        }
      });
  }
}
