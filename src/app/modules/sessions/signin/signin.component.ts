import { Component, OnInit } from "@angular/core";
import { ApplicationData, SessionsConstants } from "../session.constant";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "../login.service";
import { CommonService } from "app/shared/services/common-service/common.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TokenStorageService } from "app/shared/token-storage.service";
import { SessionService } from "app/shared/session.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent implements OnInit {
  appData: ApplicationData = SessionsConstants.APPLICATION_DATA;
  signinForm: FormGroup;
  hide = true;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "70px",
      height: "70px",
    },
  };
  authType: string = "signIn";
  otp: any;
  profileRes: any;
  currentUser: any;
  netBankUser: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private login: LoginService,
    private commonService: CommonService,
    private snack: MatSnackBar,
    private sessionService: SessionService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUser();
    this.initform();
  }

  initform() {
    this.signinForm = this.fb.group({
      corporateId: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", Validators.required],
      otpRequired: [true],
    });
  }

  submit() {
    let payload = this.signinForm.value;
    this.login.getProfile(payload).subscribe((res: any) => {
      if (res?.status == 200) {
        this.authType = "otp";
        this.getProfile();
      }
    });
  }

  onOtpChange(otp) {
    this.otp = otp;
  }
  goBack() {
    this.authType = "signIn";
  }
  onVerify() {
    let payload = {
      email: this.currentUser.email,
      otp: this.otp,
    };
    this.commonService.verifyOTP(payload).subscribe((res: any) => {
      if (res.data !== "Invalid OTP") {
        this.tokenService.saveNetBankingUser(this.netBankUser);
        this.router.navigate(["/user/dashboard/home"]);
      } else {
        this.snack.open(res.message, "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
        });
      }
    });
  }
  getProfile() {
    this.sessionService.getProfileInfo().subscribe(
      (res) => {
        this.profileRes = res;
        this.netBankUser = res;
      },
      (err) => {}
    );
  }
}
