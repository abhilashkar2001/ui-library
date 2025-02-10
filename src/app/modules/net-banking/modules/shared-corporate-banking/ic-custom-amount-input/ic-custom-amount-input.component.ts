import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createMask } from 'app/shared/directives/input-mask/constants';
import { findCurrency } from 'app/shared/helpers/utils';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-ic-custom-amount-input',
  templateUrl: './ic-custom-amount-input.component.html',
  styleUrls: ['./ic-custom-amount-input.component.scss'],
})
export class IcCustomAmountInputComponent implements OnChanges, OnDestroy {
  @Input() direction: string | undefined | null;
  @Input() control!: AbstractControl | undefined | null;
  @Input() isdControl: AbstractControl | undefined | null = new FormControl('');
  @Input() suffixDropdownControl: AbstractControl | undefined | null;
  @Input() inputLabel = '';
  @Input() matSuffix: string | undefined;
  @Input() customLabelClass: string | undefined;
  @Input() customClass: string | undefined;
  @Input() hintText: string | undefined;
  @Input() readonly = false;
  @Input() isdCode: any;
  @Input() currencyCode: string | any;
  @Input() suffixDropdown: any;
  @Input('verify') verifyBtn = false;
  @Input('verifyMob') verifyMobBtn = false;
  @Input() errorMessage = '';
  @Input() country: any;
  @Input() showInfoIcon = false;
  @Input() hide = false;
  @Input() inputType: string | undefined; // New input for desired input type
  @Input() proceedButton = false;
  @Input() maxAmount: number | undefined;
  @Input() minAmount: number | undefined;

  @Output() onChange = new EventEmitter<any>();
  @Output() onKeyUp = new EventEmitter<any>();

  isRequired = false;
  currencyMask: any;
  currentCurrency: any;
  profileInfo: any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.loadUserProfile();
    this.currentCurrency = findCurrency(this.profileInfo.branchCrncyCode);
  }
  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.profileInfo = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currencyCode']?.currentValue) {
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    if (this.control) this.isRequired = this.checkIfRequired(this.control);
    this.currencyMask = createMask({
      alias: 'numeric',
      groupSeparator: `${this.currentCurrency?.thousandsSeparator}`,
      // prefix: `${this.currentCurrency?.symbol} `,
      digits: 3,
      digitsOptional: false,
      placeholder: '0',
      allowMinus: false,
      autoUnmask: false,
      unmaskAsNumber: false,
      formatter: (value: string) => {
        if (value && value.length > 15) {
          // Manually format large numbers (avoid JS precision issues)
          return this.formatLargeNumber(value);
        }
        return value;
      },
      onBeforeMask: (value: string) => {
        return value;
      },

      onUnMask: (maskedValue: string) => {
        return maskedValue;
      },
    });
    this.currencyCode = this.profileInfo?.branchCrncyCode;
  }
  formatLargeNumber(value: string): string {
    const plainValue = value.replace(/,/g, '');
    return plainValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  checkIfRequired(control: AbstractControl): boolean {
    if (!control || !control.validator) {
      return false;
    }
    const validator = control.validator({} as FormControl);
    return validator && validator['required'] ? true : false;
  }

  handleChange(event: any) {
    if (this.minAmount && this.minAmount > this.control?.value) {
      this.control?.setValue(this.minAmount);
    } else if (this.maxAmount && this.maxAmount < this.control?.value) {
      this.control?.setValue(this.maxAmount);
    }
    this.onChange.emit(event.target.value);
  }
  hendeledKeyUpEvent(event: any) {
    this.onKeyUp.emit(event);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
