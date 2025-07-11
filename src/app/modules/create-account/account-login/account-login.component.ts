import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  AppState,
  LocaleData,
  selectLocaleData,
  selectUser,
  User,
} from '@onerumango/utils';
import { TrackingService } from 'app/modules/origination/modules/tracking/tracking-service';
import { debounceTime, Observable, Subscription } from 'rxjs';
import { CountryService } from '../../../shared/services/country-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.component.html',
  styleUrls: ['./account-login.component.scss'],
})
export class AccountLoginComponent implements OnInit {
  countriesIsdCodes: any[] = [];
  countryTelIsdCode: any;
  defaultIsdCodeValue: any;
  maxMobileLength: any;
  subscriptions: Subscription[] = [];
  otpForm!: FormGroup;
  @Input() showOtpSection: boolean | any;
  @Input() invalidOtp: boolean | any;
  @Input() otpSent: boolean | any;
  @Input() isLoading = false;
  displaySecond: string | any;
  getOtpBtn = false;
  validNumber = false;
  resendLink = false;
  resendOtp = 0;
  intervalId: any;
  otpAvailable = false;
  private localeData: LocaleData | undefined;
  profileInfo: any;
  userProfile$!: Observable<User | null>;

  constructor(
    private countryService: CountryService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private otpService: TrackingService,

    private router: Router,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
  }

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

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  buildForm() {
    this.otpForm = this.fb.group({
      phone: [''],
      isdCode: [''],
      otpValue: [''],
    });

    this.otpForm
      .get('phone')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        this.otpForm.get('phone')?.setErrors(null);
        if (resp?.length == this.maxMobileLength) {
          this.validNumber = false;
        } else {
          this.validNumber = true;
          this.otpForm.get('phone')?.setErrors({ invalidLength: true });
        }
      });
  }

  // Get All Countrys and Isd code Mthd
  loadCountries() {
    this.countryService.getCountries().subscribe((resp: any) => {
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

  setMobileLength() {
    if (this.otpForm.get('isdCode')?.value) {
      const countryRecord = this.countriesIsdCodes.find(
        (item: any) =>
          item.countryTelIsdCode == this.otpForm.get('isdCode')?.value,
      );

      this.maxMobileLength = countryRecord?.mobileLength;
    }
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
    this.isLoading = true;
    this.otpService
      .verifyOtp({
        mobile: this.otpForm.value.phone,
        otp: this.otpForm.value?.otpValue,
      })
      .subscribe((response: any) => {
        console.log(response);
      });
    this.router.navigate(['create-account/stages']);
  }

  onExit() {
    console.log('need to starr');
  }
}
