import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { debounceTime } from 'rxjs/operators';
import { selectLocaleData } from '@onerumango/utils';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { DataService } from 'app/shared/services/table-service/data.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-common-emi-calculator',
  templateUrl: './common-emi-calculator.component.html',
  styleUrls: ['./common-emi-calculator.component.scss'],
})
export class CommonEmiCalculatorComponent implements OnInit, OnDestroy {
  max = 1000000;
  min = 10000;
  maxValue = 0;
  minValue = 0;
  ammountValue = 0;
  loanForm!: FormGroup | any;
  @Input() fdName = 'rdCalculator';
  @Input() calculatorInfo = {};
  @Output() customCalculatorValues = new EventEmitter<any>();
  amount = new FormControl('');
  email = new FormControl('');
  thumbLabel: boolean | any = true;
  productDetails: any;
  interestPayble = 0;
  totalPayableAmmount = 0;
  emiAmount: any = 0;
  interestDetails: any;
  otherUserInfo: any;
  currency: any = 'INR';
  interestRate = 10.1;
  valueChangesSubscription: Subscription | any;
  subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private loanApi: LoanService,
    private dataService: DataService,
    private sessionStorageService: SessionStorageService,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.loadLocaleData();
    this.cleanCache();
    const basisId: any = this.sessionStorageService.getLoanBasisDetails();
    this.getProductDetails(basisId.basisId);
    setTimeout(() => {
      this.buildForm();
    }, 500);
  }

  loadLocaleData(): void {
    const localeDataSub = this.store
      .select(selectLocaleData)
      .subscribe((res) => {
        if (res) {
          console.log(res);
          this.otherUserInfo = res;
          this.currency = this.otherUserInfo?.currency;
        }
      });

    this.subscriptions.push(localeDataSub);
  }
  getProductDetails(basisId: any) {
    this.loanApi.getProductAspectDetails(basisId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.productDetails = resp.data[0]?.lendingParameters.find(
          (el: any) => el.currency == this.otherUserInfo.currency,
        );
        this.min = this.productDetails.minimumAmount;
        this.max = this.productDetails.maximumAmount;
        this.maxValue =
          this.interestRate + this.productDetails?.maxRateVariancePercentage ||
          0;
        this.minValue = Math.abs(
          this.interestRate - this.productDetails?.minRateVariancePercentage ||
            0,
        );
      }
    });

    this.loanApi.getProductInterestDetails(basisId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        resp.data.forEach((item: any) => {
          if (item?.isPrimary) {
            this.interestDetails = item;
          }
        });
      }
    });
  }
  onSliderChange(e: any) {
    this.ammountValue = e.srcElement.ariaValueText;
    console.log(e.srcElement.ariaValueText);
    if (
      Number(this.ammountValue) == 0 ||
      Number(this.ammountValue) < this.min
    ) {
      this.loanForm.get('amount').setValue(this.min);
      return;
    }
    this.loanForm.get('amount').setValue(e.srcElement.ariaValueText);
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.loanForm = this.fb.group({
      amount: [this.min],
      tenureYear: '',
      tenureMonth: '',
      tenureDays: '',
      interestRate: [this.interestRate, [Validators.required]],
    });

    this.valueChangesSubscription = this.loanForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        if (
          this.loanForm.value.interestRate &&
          this.loanForm.value.amount &&
          (this.loanForm.value.tenureYear ||
            this.loanForm.value.tenureMonth ||
            this.loanForm.value.tenureDays)
        ) {
          this.calculateTenure(
            parseInt(this.loanForm.value.tenureYear) || 0,
            parseInt(this.loanForm.value.tenureMonth) || 0,
            parseInt(this.loanForm.value.tenureDays) || 0,
          ).then((result) => {
            const payload = {
              principleAmount: parseInt(this.loanForm.value.amount),
              interestRate: parseFloat(this.loanForm.value.interestRate),
              numberOfMonths: result,
              firstRepaymentDate: moment(new Date()).format('YYYY-MM-DD'),
            };
            this.loanApi.getEmiCalculation(payload).subscribe((resp: any) => {
              this.interestPayble = Math.round(resp.data.totalInterest);
              this.totalPayableAmmount = Math.round(
                resp.data.totalRepaymentAmount,
              );
              this.emiAmount = Math.round(resp.data.monthlyPayment);
            });
          });
        }
      });
  }
  calculateTenure(years: any, months: any, days: any) {
    return new Promise((resolve) => {
      const totalMonths = years * 12 + months;
      const daysInMonth = days ? Math.ceil(days / 30) : 0;
      const totalMonthsIncludingDays = totalMonths + daysInMonth;
      console.log(totalMonthsIncludingDays);
      resolve(totalMonthsIncludingDays);
    });
  }
  get checkTenurePresence() {
    const { tenureYear, tenureMonth, tenureDays } = this.loanForm.value;
    return !!tenureYear || !!tenureMonth || !!tenureDays;
  }

  applyForLoan() {
    // this.loanForm.markAllAsTouched();
    // if (
    //   this.loanForm.invalid ||
    //   !this.checkTenurePresence ||
    //   this.validateMinimumTenure ||
    //   this.validateTenure
    // ) {
    //   return;
    // }
    this.sessionStorageService.setTenureDays(this.loanForm.value.tenureDays);
    this.sessionStorageService.setTenureYear(this.loanForm.value.tenureYear);
    this.sessionStorageService.setTenureMonth(this.loanForm.value.tenureMonth);
    const obj = {
      ...this.loanForm.value,
      interestPayable: this.interestPayble,
      totalPayableAmount: this.totalPayableAmmount,
      emiAmount: this.emiAmount,
    };
    this.customCalculatorValues.emit(obj);
    this.loanForm.reset();
  }

  calculateTotalDays(
    loanTenureYear: any,
    loanTenureMonth: any,
    loanTenureDay: any,
  ) {
    const d = +loanTenureYear * 365 + +loanTenureMonth * 30 + +loanTenureDay;
    return d;
  }

  get validateMinimumTenure() {
    const totalDays = this.calculateTotalDays(
      this.loanForm.value.tenureYear || 0,
      this.loanForm.value.tenureMonth || 0,
      this.loanForm.value.tenureDays || 0,
    );
    const MinimumAllowedDays = this.calculateTotalDays(
      this.productDetails?.minimumTenorYear || 0,
      this.productDetails?.minimumTenorMonth || 0,
      this.productDetails?.minimumTenorDay || 0,
    );
    return totalDays <= MinimumAllowedDays;
  }

  get validateTenure() {
    const totalDays = this.calculateTotalDays(
      this.loanForm.value.tenureYear || 0,
      this.loanForm.value.tenureMonth || 0,
      this.loanForm.value.tenureDays || 0,
    );
    const totalAllowedDays = this.calculateTotalDays(
      this.productDetails?.maximumTenorYear || 0,
      this.productDetails?.maximumTenorMonth || 0,
      this.productDetails?.maximumTenorDay || 0,
    );
    return totalDays >= totalAllowedDays;
  }

  cleanCache() {
    this.sessionStorageService.removeUserCustomerId();
    this.sessionStorageService.removeCustomerStageId();
    this.sessionStorageService.removeCustomerId();
    this.sessionStorageService.removeOriginationId();
    this.sessionStorageService.removeOtherDocScreenCode();
    this.dataService.removeChecklistDocument();
    this.dataService.removeDisbursementDetails();
  }
}
