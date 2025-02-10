import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationData, SessionsConstants } from '../session.constant';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { NewErrorPopupComponent, TokenStorageService } from '@onerumango/utils';
import { SessionService } from 'app/shared/session.service';
import { ThemeChangeService } from 'app/shared/services/theme-change.service';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { GETGENERICVALUE } from 'app/shared/models/generic-value.model';
import { Store } from '@ngrx/store';
import { UserProfileAction } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';
import { Observable, Subscription } from 'rxjs';
import { User } from '@onerumango/utils';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, OnDestroy {
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
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private tokenService: TokenStorageService,
    private sessionService: SessionService,
    private themingService: ThemeChangeService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private sessionStorageService: SessionStorageService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.initform();
    this.loadUserProfile();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currentUser = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
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

  visibiltiy(e: Event) {
    console.log(e, 'event');
    this.hide = !this.hide;
  }

  submit() {
    const payload = this.signinForm.value;
    this.sessionStorageService.setCorporateId(payload?.corporateId);
    this.loginService.corporateLogin(payload).subscribe((res: any) => {
      this.authType = 'otp';
      this.tokenService.saveToken(res?.data);
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
          this.store.dispatch(UserProfileAction.loadUserProfile());
          const result: any = await this.fetchThemeAndLanguange();
          if (result?.data?.length) {
            this.sessionStorageService.setUserThemeLang(
              result?.data[result?.data?.length - 1],
            );
            const lang =
              result?.data[result?.data?.length - 1]?.language ?? 'en';
            this.tokenService.saveLanguage(lang);
            this.translate.use(lang);
          } else {
            this.sessionStorageService.removeUserThemeLang();
          }
          this.router.navigate(['/user/dashboard']);
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
