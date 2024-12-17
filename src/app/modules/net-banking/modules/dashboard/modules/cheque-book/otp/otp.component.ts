import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { TokenStorageService } from 'app/shared/token-storage.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  @Output() otpVerified = new EventEmitter<any>();
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '80px',
      height: '80px',
    },
  };
  otpResendTrigger: boolean | any;
  invalidOtp: boolean | any;
  otpSent = false;
  yourOtp: any;
  otpAvailable = false;
  otp: any;
  otpSection = true;
  otpVerfied = false;
  customerInfo: any;
  constructor(
    private loginService: OpenAccountService,
    private _location: Location,
    private tokenStorageService: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.customerInfo = this.tokenStorageService.getUser();
    this.getOtp();
  }

  onOtpChange(otp: any) {
    this.otp = otp;
    this.yourOtp = this.otp.toString();
    this.otpAvailable =
      this.yourOtp && this.yourOtp?.length >= 6 ? true : false;
  }

  getOtp() {
    this.loginService
      .getOtp(this.customerInfo.mobile)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) this.otpSent = true;
      });
  }

  submit() {
    if (this.yourOtp && this.yourOtp.length == 6) {
      this.verifyOtp();
    }
  }

  verifyOtp() {
    // this.loginService
    //   .verifyOtp({
    //     mobile: this.customerInfo.mobile,
    //     otp: this.yourOtp,
    //   })
    //   .subscribe(async (res: any) => {
    //     if (res?.statusCode == 401) {
    //       this.invalidOtp = true;
    //     } else if (res.statusCode === 200 || res?.accessToken) {
    //       this.invalidOtp = false;
    //       this.otpSection = false;
    //       this.otpVerfied = true;
    //       this.otpVerified.emit(this.otpVerfied);
    //     }
    //   });
    this.invalidOtp = false;
    this.otpSection = false;
    this.otpVerfied = true;
    this.otpVerified.emit(this.otpVerfied);
  }

  cancel() {
    this._location.back();
  }
}
