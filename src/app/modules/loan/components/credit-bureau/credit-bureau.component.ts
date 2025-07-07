import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TrackingService } from 'app/modules/origination/modules/tracking/tracking-service';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-credit-bureau',
  templateUrl: './credit-bureau.component.html',
  styleUrls: ['./credit-bureau.component.scss'],
})
export class CreditBureauComponent implements OnInit {
  otp = new FormControl('', [Validators.required]);
  showOtpSection = true;

  @ViewChild('consentDialog') consentDialog!: TemplateRef<any>;
  creditBureau: any;
  otpSent: boolean | undefined;
  resendLink: boolean | undefined;
  intervalId: any;
  displaySecond: string | any;
  invalidOtp = false;

  constructor(
    private dialog: MatDialog,
    private loanService: LoanService,
    private otpService: TrackingService,
  ) {}

  ngOnInit() {
    this.fetchCreditBureau();
  }

  openDialog() {
    this.dialog.open(this.consentDialog, {
      width: '40%',
      height: '40%',
      panelClass: 'custom-dialog',
    });
  }

  fetchCreditBureau() {
    this.loanService.fetchCreditBureau(962).subscribe((res: any) => {
      if (res?.statusCode == 200 || res?.statusCode == 201) {
        this.creditBureau = res?.data;
        this.getOtp();
      }
    });
  }

  getOtp() {
    this.otpService
      .getOtp({ mobile: this.creditBureau?.mobile })
      .subscribe((resp) => {
        const otp = resp?.OTP;
        if (otp && otp !== 'null') {
          this.otpSent = true;
          this.resendLink = false;
          this.stopInterval();
          this.otpTimer();
        }
      });
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
        this.stopInterval();
      }
    }, 1000);
  }

  /**
   * TO clear the timer interval.
   */
  stopInterval() {
    clearInterval(this.intervalId);
  }

  verifyOtp() {
    this.otpService
      .verifyOtp({
        mobile: this.creditBureau?.mobile,
        otp: this.otp,
      })
      .subscribe((response: any) => {
        if (response.status === 401) {
          this.invalidOtp = true;
          this.showOtpSection = true;
        } else if (response.status === 200) {
          this.showOtpSection = false;
        }
      });
  }

  handleSubmit() {
    return of('success' as const);
  }

  submitForm() {
    return this.handleSubmit().toPromise();
  }
}
