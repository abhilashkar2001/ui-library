import { Component, OnInit } from '@angular/core';
import { ApplicationData, SessionsConstants } from '../session.constant';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { TokenStorageService } from 'app/shared/token-storage.service';
import { SessionService } from 'app/shared/session.service';
import { ThemeChangeService } from 'app/shared/services/theme-change.service';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { NewErrorPopupComponent } from 'app/modules/home/new-error-popup/new-error-popup.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { GETGENERICVALUE } from 'app/shared/models/generic-value.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  appData: ApplicationData = SessionsConstants.APPLICATION_DATA;
  signinForm!: FormGroup;
  hide = true;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '70px',
      height: '70px',
    },
  };
  authType = 'signIn';
  otp: any;
  currentUser: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private tokenService: TokenStorageService,
    private sessionService: SessionService,
    private themingService: ThemeChangeService,
    private dialog: MatDialog,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenService.getUser();
    this.initform();
  }

  initform() {
    this.signinForm = this.fb.group({
      corporateId: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      // otpRequired: [true],
      appType: ['CORP'],
    });
  }

  submit() {
    const payload = this.signinForm.value;
    this.tokenService.setCorporateId(payload?.corporateId);
    this.loginService.corporateLogin(payload).subscribe((res: any) => {
      // if (res?.status == 200) {
      this.authType = 'otp';
      this.tokenService.saveToken(res?.data);

      // }
    });
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }
  goBack() {
    this.authType = 'signIn';
  }

  onVerify() {
    this.getProfile();
    // this.commonService.verifyOTP(payload).subscribe((res: any) => {
    //   if (res.data !== "Invalid OTP") {
    //     this.tokenService.saveToken(res?.accessToken);
    //     this.getProfile();
    //   } else {
    //     this.snack.open(res.message, "OK", {
    //       duration: 4000,
    //       verticalPosition: "top",
    //       horizontalPosition: "right",
    //     });
    //   }
    // });
  }

  fetchThemeAndLanguange() {
    return new Promise((resolve, reject) => {
      this.themingService.fetchCurrentTheme(2456).subscribe(
        (res: IcHttpResponseModel<any> | any) => {
          resolve(res);
        },
        (err) => reject(err),
      );
    });
  }
  getProfile() {
    this.sessionService
      .getCorporateProfile()
      .subscribe(async (res: GETGENERICVALUE) => {
        if (res?.status == 401) {
          console.log(res);
          const errPayload = {
            error: res?.error,
            message: res?.message,
            statusCode: res?.status,
          };
          this.dialog.open(NewErrorPopupComponent, {
            width: '45%',
            height: '50%',
            disableClose: true,
            data: {
              type: 'customError',
              errPayload,
            },
          });
        } else {
          console.log(res);
          this.tokenService.saveUser(res);
          const result: any = await this.fetchThemeAndLanguange();
          if (result?.data?.length) {
            sessionStorage.setItem(
              'userThemeLang',
              JSON.stringify(result?.data[result?.data?.length - 1]),
            );
            const lang =
              result?.data[result?.data?.length - 1]?.language ?? 'en';
            this.tokenService.saveLanguage(lang);
            this.translate.use(lang);
          } else {
            sessionStorage.removeItem('userThemeLang');
          }
          this.router.navigate(['/user/dashboard']);
        }
      });
  }
}
