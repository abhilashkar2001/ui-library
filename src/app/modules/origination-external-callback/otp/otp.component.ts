import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { User } from "app/shared/models/user.model";
import { OtpService } from "app/shared/services/otp.service";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OtpComponent implements OnInit {
  currentUser: User;
  otpType = "Email";

  otpForm: FormGroup;
  ngOtpConfig: any = {
    length: 6,
    allowNumbersOnly: false,
    isPasswordInput: true,
  };

  cardArr: string[] = ["Email", "Mobile"];
  constructor(
    private tokenStorageService: TokenStorageService,
    private otpService: OtpService,
    private snack: MatSnackBar,
    private route: Router
  ) {
    this.otpForm = new FormGroup({
      email: new FormControl(""),
      mobile: new FormControl(""),
      otp: new FormControl("", [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
  }

  generateOtp() {
    this.otpService.generateOTP(this.otpForm.value).subscribe((res) => {
      if (res?.statusCode == 200) {
        this.snack.open("Otp sent successfully", "Ok", {
          horizontalPosition: "right",
          verticalPosition: "top",
          duration: 2000,
        });
      }
    });
  }

  onOtpChange(otp) {
    this.otpForm.get("otp").setValue(otp);
  }

  verifyOtp() {
    this.otpService.verifyOTP(this.otpForm.value).subscribe((res) => {
      if (res?.accessToken) {
        this.route.navigate(["/origination/process-offer"]);
      }
    });
  }
}
