import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SidenavService } from 'app/shared/services/sidenav.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
})
export class OtpVerificationComponent {
  @Input() data: any;
  @Input() showOtpSection: boolean | any;
  @Input() invalidOtp: boolean | any;
  @Input() otpSent: boolean | any;
  @Input() isLoading = false;
  otpVerificationForm!: FormGroup;
  displaySecond: string | any;
  resendLink = false;
  getOtpBtn = false;
  validNumber = false;
  resendOtp = 0;
  intervalId: any;
  otpAvailable = false;
  constructor(
    private fb: FormBuilder,
    private sidenavService: SidenavService,
  ) {}

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.otpVerificationForm = this.fb.group({
      verificationCode: [''],
      transactionPassword: [''],
    });
  }

  onExit() {}
  cancelOtp() {
    this.sidenavService.close();
  }
  submitOtp() {
    this.sidenavService.close();
  }

  //  getOtp() {
  //     const value = this.otpForm.value.phone;
  //     this.otpService.getOtp({ mobile: value }).subscribe((resp) => {
  //       const otp = resp?.OTP;
  //       if (otp && otp !== 'null') {
  //         this.otpSent = true;
  //         this.showOtpSection = true;
  //         this.getOtpBtn = true;
  //         this.validNumber = true;
  //         this.resendLink = false;
  //         this.invalidOtp = false;
  //         this.resendOtp += 1;
  //         this.stopInterval();
  //         this.otpTimer();
  //         setTimeout(() => {
  //           this.otpSent = false;
  //         }, 500000);
  //       }
  //     });
  //   }

  getOtp() {
    // const value = this.otpForm.value.phone;

    // // Simple mock validation for phone number
    // if (!value || value.length < 10) {
    //   this.validNumber = false;
    //   return;
    // }

    // Simulate OTP send success (mock OTP)
    const otp = '123456'; // Hardcoded test OTP
    console.log('Mock OTP sent:', otp);

    this.otpSent = true;
    this.showOtpSection = true;
    this.getOtpBtn = true;
    this.validNumber = true;
    this.resendLink = false;
    this.invalidOtp = false;
    this.resendOtp += 1;
    this.stopInterval();
    this.otpTimer();

    // Auto-hide after 5 minutes
    setTimeout(() => {
      this.otpSent = false;
    }, 500000);
  }

  otpTimer() {
    this.stopInterval();
    const minute = 0.5;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec = 30;
    const prefix = minute < 10 ? '0' : '';
    this.intervalId = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 30;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.displaySecond = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds == 0) {
        this.resendLink = true;
        // this.ngOtpInput?.otpForm?.disable();
        this.stopInterval();
      }
      this.otpTimerReset({ seconds: this.displaySecond });
    }, 1000);
  }

  otpTimerReset(event: any) {
    if (event.seconds == '00:00') {
      this.isLoading = false;
      this.otpAvailable = false;
    }
  }

  verifyOtp(enteredOtp: string) {
    if (enteredOtp === '123456') {
      console.log('OTP verified successfully');
      this.invalidOtp = false;
      // Navigate or proceed
    } else {
      console.log('Invalid OTP');
      this.invalidOtp = true;
    }
  }

  // otpTimer() {
  //   this.stopInterval();
  //   const minute = 0.5;
  //   let seconds: number = minute * 60;
  //   let textSec: any = '0';
  //   let statSec = 30;
  //   const prefix = minute < 10 ? '0' : '';
  //   this.intervalId = setInterval(() => {
  //     seconds--;
  //     if (statSec != 0) statSec--;
  //     else statSec = 30;

  //     if (statSec < 10) {
  //       textSec = '0' + statSec;
  //     } else textSec = statSec;

  //     this.displaySecond = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
  //     if (seconds == 0) {
  //       this.resendLink = true;
  //       // this.ngOtpInput?.otpForm?.disable();
  //       this.stopInterval();
  //     }
  //     this.otpTimerReset({ seconds: this.displaySecond });
  //   }, 1000);
  // }

  // otpTimerReset(event: any) {
  //   if (event.seconds == '00:00') {
  //     this.isLoading = false;
  //     this.otpAvailable = false;
  //   }
  // }

  // /**
  //  * TO clear the timer interval.
  //  */
  stopInterval() {
    clearInterval(this.intervalId);
  }
}
