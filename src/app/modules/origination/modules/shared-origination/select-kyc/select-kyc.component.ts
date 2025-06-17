import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-kyc',
  templateUrl: './select-kyc.component.html',
  styleUrls: ['./select-kyc.component.scss'],
})
export class SelectKycComponent implements OnInit {
  @Output() customSaveVerify = new EventEmitter<
    Record<string, never> | object
  >();
  @Output() customFormGroupEmit = new EventEmitter<
    Record<string, never> | object
  >();
  @Output() customgoBack = new EventEmitter<Record<string, never> | object>();
  kycForm!: FormGroup;
  isShowOtp = false;
  isResend = false;
  otp = '';
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };
  isChecked = false;
  yourOtp: any = '';
  display: any;
  getOtpBtn = true;
  documentTypeArray: any;
  staticData = {
    DOCUMENTTYPE: [],
  };
  displaySecond: string | any;
  resendLink: boolean | any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildKycForm();
    setTimeout(() => {
      this.customFormGroupEmit.emit(this.kycForm);
    }, 200);
  }

  onOtpChange(e: any) {
    this.yourOtp = e.toString();
  }

  buildKycForm() {
    this.kycForm = this.fb.group({
      verifyNationalID: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(12),
        ]),
      ],
    });
    this.customFormGroupEmit.emit(this.kycForm);
  }

  // verify() {
  //   const payload = {
  //     mobile: this.kycForm.value.verifyNationalID,
  //     otp: this.yourOtp
  //   };
  // }
  getOtp() {
    this.isShowOtp = true;
    this.getOtpBtn = false;
    this.otpTimer();
  }

  otpTimer() {
    const minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec = 60;
    const prefix = minute < 10 ? '0' : '';
    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.displaySecond = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.resendLink = true;
        clearInterval(timer);
      }
    }, 1000);
  }

  isvalid() {
    if (this.kycForm.get('verifyNationalID')?.valid && this.getOtpBtn) {
      return false;
    } else {
      return true;
    }
  }

  timer(minute: any) {
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec = 60;
    const prefix = minute < 10 ? '0' : '';
    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;
      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;
      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds == 0) {
        console.log('finished');
        clearInterval(timer);
      }
    }, 1000);
  }

  goBack() {
    this.customgoBack.emit();
  }
}
