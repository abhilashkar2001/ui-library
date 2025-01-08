import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { debounceTime } from 'rxjs/operators';
import { ErrorNotifierPopupComponent } from '../error-notifier-popup/error-notifier-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-common-mobile-verification',
  templateUrl: './common-mobile-verification.component.html',
  styleUrls: ['./common-mobile-verification.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        }),
      ),
      transition('void <=> *', animate(1000)),
    ]),
  ],
})
export class CommonMobileVerificationComponent implements OnInit, OnChanges {
  @Output() getOTP: EventEmitter<any> = new EventEmitter();
  @Output() enteredOTP: EventEmitter<any> = new EventEmitter();
  @Output() CustomSubmit: EventEmitter<any> = new EventEmitter();
  @Output() mobileExitEvent: EventEmitter<any> = new EventEmitter();
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Input() showOtpSection: boolean | any;
  @Input() invalidOtp: boolean | any;
  @Input() otpSent: boolean | any;
  @Input() hideInfo = false;
  @Input() updateParentModel: ((value: Partial<any>) => void) | any;
  otpForm!: FormGroup;
  phone: string | any;
  otp: any;
  agreed = false;
  resendLink = false;
  displaySecond: string | any;
  getOtpBtn = true;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '80px',
      height: '80px',
    },
  };
  validNumber = true;
  countriesIsdCodes: any[] = [];
  countryTelIsdCode: any[] = [];
  selectedIsdCode: any = '';
  isValidMobile = false;
  selectedIsd: any;
  defaultIsdCodeValue: any;
  resendOtp = 0;
  maxMobileLength: number | any;
  intervalId: any;
  otpAvailable = false;
  yourOtp: any;
  // SAVE BUTTON PROPERTIES
  @Input() isLoading = false;
  @Input() basisName = '';
  loadingBtnText = 'Saving...';
  @Input() mobileVerifyInfo: any = {};

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private api: OpenAccountService,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
  ) {
    this.buildFormGroup();
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (this.otpSent) {
      this.otpTimer();
    }
    if (changes.hideInfo) this.hideInfo = changes.hideInfo.currentValue;
  }

  onGetOTP() {
    this.ngOtpInput.otpForm.reset();
    this.api.getOtp(this.otpForm.value.phone).subscribe(() => {
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
    });
  }

  loadCountries() {
    this.commonService.getAllCountries().subscribe(
      (resp: any) => {
        if (resp?.data) {
          this.countriesIsdCodes = resp?.data;
          this.countryTelIsdCode = resp?.data.map(
            (i: any) => i?.countryTelIsdCode,
          );
          console.log(this.countriesIsdCodes);
          console.log(this.countryTelIsdCode);
          const indiaIsdCode = this.countriesIsdCodes.find(
            (item: any) => item?.countryName.toLowerCase() == 'india',
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
      },
      (err) => console.error('Error: ', err),
    );
  }

  onOtpChange(otp: any) {
    this.otp = otp;
    this.yourOtp = this.otp.toString();
    this.otpAvailable =
      this.yourOtp && this.yourOtp?.length >= 6 ? true : false;
  }
  isValidated() {
    if (this.otpForm.value.phone?.length === 10 && this.getOtpBtn) {
      return false;
    }
    return true;
  }

  onAgreed() {
    this.agreed = !this.agreed;
    this.enteredOTP.emit({
      otp: this.otp,
      agreed: this.agreed,
    });
  }

  buildFormGroup() {
    this.otpForm = this.fb.group({
      phone: [''],
      isdCode: [''],
    });
    this.otpForm
      .get('phone')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        const regExp = /^[0]+$/;
        if (resp?.length == this.maxMobileLength) {
          this.isValidMobile = regExp.test(resp);
          this.validNumber = false;
        } else {
          this.isValidMobile = false;
          this.validNumber = true;
          this.otpForm.get('phone')?.setErrors({ invalidLength: true });
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
      this.otpTimerReset({ seconds: this.displaySecond });
    }, 1000);
  }

  otpTimerReset(event: any) {
    if (event.seconds == '00:00') {
      this.isLoading = false;
      this.otpAvailable = false;
    }
  }

  onIsdCodeSelected(isdCode: any) {
    this.selectedIsd = isdCode;
  }
  setMobileLength() {
    if (this.otpForm.get('isdCode')) {
      const countryRecord = this.countriesIsdCodes.find(
        (item: any) =>
          item.countryTelIsdCode == this.otpForm.get('isdCode')?.value,
      );
      this.maxMobileLength = countryRecord.mobileLength;
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
    this.loadingBtnText = 'Saving...';
    this.api
      .verifyOtp({ mobile: this.otpForm.value.phone, otp: this.yourOtp })
      .subscribe((response: any) => {
        if (response.statusCode === 401) {
          this.invalidOtp = true;
          this.isLoading = false;
        } else if (response.statusCode === 200 || response?.accessToken) {
          this.loadingBtnText = 'Saved';
          this.isLoading = false;
          this.invalidOtp = false;
          if (!this.hideInfo)
            this.onVerifyExistingProduct({ phone: this.otpForm.value.phone });
          this.CustomSubmit.emit({});
        }
      });
  }

  onExit() {
    this.mobileExitEvent.emit();
  }

  onVerifyExistingProduct(event: any) {
    const type = !this.mobileVerifyInfo?.individual ? 'corporate' : '';
    // this.isLoading = true;
    this.api
      .checkMobileAndProduct(
        this.mobileVerifyInfo.basisName,
        event.phone,
        this.mobileVerifyInfo.productDuplicationKey,
      )
      .subscribe((resp) => {
        if (!resp) {
          this.allreadyProduct(
            `We have found similar ${this.mobileVerifyInfo.applicationType} in our record on your Mobile Number`,
            'Please visit bank for more information.',
            false,
          );
        } else {
          this.api
            .getExistingCustomer(event.phone, type)
            .subscribe((resp: any) => {
              // Here cleaning the all ids from cache.
              this.cleanCacheInMobileScreen();
              if (resp?.statusCode === 200 && resp?.data) {
                if (type) {
                  this.allreadyProduct(
                    `Corporate account is already present with this mobile number.`,
                    'Please visit bank for more information.',
                    true,
                  );
                }
                if (resp?.data?.length > 0) {
                  this.sessionStorageService.setMobileNo(event.phone);
                  if (
                    this.mobileVerifyInfo.applicationType === 'loan application'
                  ) {
                    const customerIds: any[] = [];
                    resp.data.forEach((element: any) => {
                      customerIds.push(element.customerId);
                    });
                    this.sessionStorageService.setUserCustomerId(
                      JSON.stringify(customerIds),
                    );
                  } else {
                    this.sessionStorageService.setUserCustomerId(
                      resp.data[0].customerId,
                    );
                  }
                  this.CustomSubmit.emit({ personalInfo: resp.data });
                  this?.updateParentModel({
                    personalInfo: resp.data,
                    updateMasterSave: false,
                  });
                }
              } else {
                this.CustomSubmit.emit({
                  personalInfo: resp?.data,
                });
                this?.updateParentModel({
                  personalInfo: resp?.data,
                  updateMasterSave: false,
                });
                this.sessionStorageService.setMobileNo(event.phone);
              }
            });
        }
      });
  }
  allreadyProduct(
    errorMessage: any,
    errorMessageHint: any,
    showCancelBtn: any,
  ) {
    const dialogRef = this.dialog.open(ErrorNotifierPopupComponent, {
      data: {
        errorMessage: errorMessage,
        errorMessageHint: errorMessageHint,
        showCancelBtn: showCancelBtn,
      },
      width: '650px',
      disableClose: true,
      panelClass: 'popup-dialog-class',
      backdropClass: 'bdrop',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res == 'cancel') this.backEvent.emit();
    });
  }
  cleanCacheInMobileScreen() {
    this.sessionStorageService.removeOriginationId();
    this.sessionStorageService.removeUserCustomerId();
    this.sessionStorageService.removeCustomerStageId();
    this.sessionStorageService.removeCustomerId();
    this.sessionStorageService.removeOriginationId();
    this.sessionStorageService.removeOtherDocScreenCode();
  }
}
