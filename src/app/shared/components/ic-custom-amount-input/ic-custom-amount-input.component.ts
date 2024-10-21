import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";
import { createMask } from "app/shared/directives/input-mask/constants";
import { findCurrency } from "app/shared/helpers/utils";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-ic-custom-amount-input",
  templateUrl: "./ic-custom-amount-input.component.html",
  styleUrls: ["./ic-custom-amount-input.component.scss"],
})
export class IcCustomAmountInput implements OnChanges {
  @Input("direction") direction: string | undefined | null;
  @Input("control") control!: AbstractControl | undefined | null;
  @Input("isdControl") isdControl: AbstractControl | undefined | null =
    new FormControl("");
  @Input("suffixDropdownControl") suffixDropdownControl:
    | AbstractControl
    | undefined
    | null;
  @Input("inputLabel") inputLabel: string = "";
  @Input("matSuffix") matSuffix: string | undefined;
  @Input("customLabelClass") customLabelClass: string | undefined;
  @Input("customClass") customClass: string | undefined;
  @Input("hintText") hintText: string | undefined;
  @Input("readonly") readonly: boolean = false;
  @Input("isdCode") isdCode: any;
  @Input("currencyCode") currencyCode: string | undefined;
  @Input("suffixDropdown") suffixDropdown: any;
  @Input("verify") verifyBtn: boolean = false;
  @Input("verifyMob") verifyMobBtn: boolean = false;
  @Input("errorMessage") errorMessage: string = "";
  @Input("country") country: any;
  @Input("showInfoIcon") showInfoIcon: boolean = false;
  @Input("hide") hide: boolean = false;
  @Input() inputType: string | undefined; // New input for desired input type
  @Input() proceedButton: boolean = false;
  @Input("maxAmount") maxAmount: number | undefined;
  @Input("minAmount") minAmount: number | undefined;

  @Output() onChange = new EventEmitter<any>();
  @Output() onKeyUp = new EventEmitter<any>();

  isRequired: boolean = false;
  currencyMask: any;
  currentCurrency: any;
  profileInfo: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private tokenService: TokenStorageService
  ) {
    this.profileInfo = this.tokenService.getUser();
    this.currentCurrency = findCurrency(this.profileInfo.branchCrncyCode);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["currencyCode"]?.currentValue) {
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    if (this.control) this.isRequired = this.checkIfRequired(this.control);

    this.currencyMask = createMask({
      alias: "numeric",
      groupSeparator: `${this.currentCurrency?.thousandsSeparator}`,
      // prefix: `${this.currentCurrency?.symbol} `,
      digits: 3,
      digitsOptional: false,
      placeholder: "0",
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
    this.currencyCode = this.profileInfo.branchCrncyCode;
  }
  formatLargeNumber(value: string): string {
    let plainValue = value.replace(/,/g, "");
    return plainValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  checkIfRequired(control: AbstractControl): boolean {
    if (!control || !control.validator) {
      return false;
    }
    const validator = control.validator({} as FormControl);
    return validator && validator["required"] ? true : false;
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
}
