import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, LocaleData, selectLocaleData } from '@onerumango/utils';
import { TrackingService } from 'app/modules/origination/modules/tracking/tracking-service';

import { CommonService } from 'app/shared/services/common-service/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  countriesIsdCodes: any[] = [];
  countryTelIsdCode: any;
  defaultIsdCodeValue: any;
  maxMobileLength: any;
  subscriptions: Subscription[] = [];
  otpForm!: FormGroup;
  private localeData: LocaleData | undefined;
  @Input() showOtpSection: boolean | any;
  @Input() invalidOtp: boolean | any;
  @Input() otpSent: boolean | any;
  @Input() isLoading = false;
  displaySecond: string | any;
  getOtpBtn = false;
  validNumber = false;
  isValidMobile = false;
  resendLink = false;
  resendOtp = 0;
  intervalId: any;
  otpAvailable = false;

  constructor(
    private commonService: CommonService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private otpService: TrackingService,
  ) {}

  ngOnInit(): void {
    const localeData$ = this.store
      .select(selectLocaleData)
      .subscribe((res: any) => {
        if (res) {
          this.localeData = res;
        }
      });
    this.subscriptions.push(localeData$);

    this.loadCountries();
    this.buildForm();
  }

  buildForm() {
    this.otpForm = this.fb.group({
      phone: [''],
      isdCode: [''],
      otpValue: [''],
    });
  }
  // Get All Countrys and Isd code Mthd
  loadCountries() {
    this.commonService.getAllCountries().subscribe((resp: any) => {
      if (resp.data.length > 0) {
        this.countriesIsdCodes = resp?.data;
        this.countryTelIsdCode = resp?.data.map(
          (i: any) => i?.countryTelIsdCode,
        );
        const indiaIsdCode = this.countriesIsdCodes.find(
          (item: any) => item?.countryName == this.localeData?.country,
        );

        if (indiaIsdCode) {
          this.defaultIsdCodeValue = indiaIsdCode?.countryTelIsdCode;
          this.maxMobileLength = indiaIsdCode?.mobileLength;
        } else {
          this.defaultIsdCodeValue =
            this.countriesIsdCodes[0].countryTelIsdCode;
          this.maxMobileLength = this.countriesIsdCodes[0]?.mobileLength;
        }

        this.otpForm.get('isdCode')?.setValue(this.defaultIsdCodeValue);
      }
    });
  }

  // getOtp Method
  getOtp() {
    const value = this.otpForm.value.phone;
    this.otpService.getOtp({ mobile: value }).subscribe((resp) => {
      const otp = resp?.OTP;
      if (otp && otp !== 'null') {
        this.otpSent = true;
        this.showOtpSection = true;
        this.getOtpBtn = true;
        this.validNumber = true;
        this.resendLink = false;
        this.invalidOtp = false;
        this.resendOtp += 1;
        this.stopInterval();
        this.otpTimer();
        setTimeout(() => {
          this.otpSent = false;
        }, 500000);
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

  /**
   * TO clear the timer interval.
   */
  stopInterval() {
    clearInterval(this.intervalId);
  }

  onVerify() {
    console.log('need to start');
  }

  onExit() {
    console.log('need to starr');
  }
}
