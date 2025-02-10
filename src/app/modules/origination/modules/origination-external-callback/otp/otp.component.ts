import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OtpService } from 'app/shared/services/otp.service';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';
import { Observable, Subscription } from 'rxjs';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit, OnDestroy {
  currentUser: User | any;
  otpType: any = 'Email';

  otpForm: FormGroup;
  ngOtpConfig: any = {
    length: 6,
    allowNumbersOnly: false,
    isPasswordInput: true,
  };

  cardArr: string[] = ['Email', 'Mobile'];
  screenName: any = '';
  customerId: any;
  reducedMob: number | any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private otpService: OtpService,
    private snack: MatSnackBar,
    private route: Router,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private store: Store,
    private sessionStorageService: SessionStorageService,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.otpForm = new FormGroup({
      email: new FormControl(''),
      mobile: new FormControl(''),
      otp: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.router.queryParams.subscribe((params) => {
      this.screenName = params['type'];
    });
    if (this.screenName != '' && this.screenName != undefined) {
      (this.customerId = this.sessionStorageService.getCustomerId()),
        this.otpForm
          .get('mobile')
          ?.patchValue(this.sessionStorageService.getMobile());
      this.reducedMob = this.otpForm.get('mobile')?.value % 1000;
      setTimeout(() => {
        this.generateOtp();
      }, 100);
    }
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currentUser = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  resetOrExit(value: any) {
    if (value == 'Reset') {
      this.otpForm.get('otp')?.reset('');
    } else {
      this.route.navigate(['/home']);
    }
  }

  generateOtp() {
    this.otpService.generateOTP(this.otpForm.value).subscribe((res) => {
      if (res?.statusCode == 200) {
        this.snack.open('Otp sent successfully', 'Ok', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000,
        });
      }
    });
  }

  onOtpChange(otp: any) {
    this.otpForm.get('otp')?.setValue(otp);
  }

  resendOtp() {
    this.generateOtp();
    this.clearOtp();
  }
  clearOtp() {
    this.otpForm.get('otp')?.patchValue('');
    this.cdr.detectChanges();
  }

  verifyOtp() {
    this.otpService.verifyOTP(this.otpForm.value).subscribe(() => {
      if (this.screenName != '' && this.screenName != undefined) {
        this.route.navigate([`/origination/document-upload`]);
      } else {
        this.route.navigate(['/home']);
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
