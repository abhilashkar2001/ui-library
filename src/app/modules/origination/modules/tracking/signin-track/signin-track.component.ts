import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TrackingService } from '../tracking-service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-signin-track',
  templateUrl: './signin-track.component.html',
  styleUrls: ['./signin-track.component.scss'],
})
export class SigninTrackComponent implements OnInit {
  screenTitle = 'Tracking Status';
  statusToggle = [
    {
      label: 'Mobile',
      value: 'mobile',
    },
    {
      label: 'Customer ID',
      value: 'customerId',
    },
  ];
  selectedStep = 0;
  screenList = [
    {
      screenCode: 17717,
      screenName: 'Application No/ Mobile No.',
      route: null,
      fileUrl: null,
      sequence: 1,
    },
    {
      screenCode: 17720,
      screenName: 'OTP Verification',
      route: null,
      fileUrl: null,
      sequence: 3,
    },
    {
      screenCode: 17723,
      screenName: 'Tracking Status',
      route: null,
      fileUrl: null,
      sequence: 2,
    },
  ];

  isShowOtpField = false;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '70px',
      height: '70px',
    },
  };
  otp: any;
  yourOtp: any;
  otpAvailable = false;
  invalidOtp = false;

  constructor(
    private fb: FormBuilder,
    private api: TrackingService,
    private route: Router,
    private sessionStorageService: SessionStorageService,
  ) {}

  signForm!: FormGroup;

  ngOnInit(): void {
    this.signForm = this.fb.group({
      status: 'mobile',
      mobile: '',
      customerId: '',
      password: '',
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
    const mobileNumber = this.signForm.value?.mobile; // Ensure type safety
    if (mobileNumber) {
      this.api.getOtp({ mobile: mobileNumber }).subscribe(() => {
        this.isShowOtpField = true;
        this.selectedStep = 1;
      });
    }
  }

  verifyOtp() {
    if (this.otpAvailable) {
      this.api
        .verifyOtp({
          mobile: this.signForm.value.mobile,
          otp: Number(this.yourOtp),
          tokenRequired: true,
        })
        .subscribe((resp: any) => {
          if (resp) {
            this.invalidOtp = false;
            this.sessionStorageService.setTrackingMobile(
              this.signForm.value.mobile,
            );
            console.log(this.route, 'calling here');
            this.route.navigate(['origination/tracking/summary']);
          } else if (resp?.statusCode === 401) {
            this.invalidOtp = true;
          }
        });
    }
  }
}
