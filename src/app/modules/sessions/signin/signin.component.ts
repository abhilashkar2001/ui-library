import { Component, OnInit } from "@angular/core";
import { ApplicationData, SessionsConstants } from "../session.constant";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

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
    length: 4,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: "",
    inputStyles: {
      width: "70px",
      height: "70px",
    },
  };
  authType: string = "signIn";
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initform();
  }

  initform() {
    this.signinForm = this.fb.group({
      corporateId: ["", Validators.required],
      loginId: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  submit() {
    this.authType = "otp";
  }

  goBack() {
    this.authType = "signIn";
  }
  onVerify() {
    this.router.navigate(["/user/dashboard/home"]);
  }
}
