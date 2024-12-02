import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { LoanService } from "app/shared/services/loan/loan.service";
import { debounceTime } from "rxjs/operators";
import { LoanCalulationService } from "../loan-calculation.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { DataService } from "app/shared/services/table-service/data.service";

@Component({
  selector: "app-common-emi-calculator",
  templateUrl: "./common-emi-calculator.component.html",
  styleUrls: ["./common-emi-calculator.component.scss"]
})
export class CommonEmiCalculatorComponent implements OnInit {
  max = 1000000;
  min = 10000;
  maxValue: number = 0;
  minValue: number = 0;
  ammountValue = 0;
  loanForm: FormGroup;
  @Input() fdName = "rdCalculator";
  @Input() calculatorInfo = {};
  @Output() customCalculatorValues = new EventEmitter<any>();
  amount = new FormControl("");
  email = new FormControl("");
  thumbLabel: boolean = true;
  currencySymboll = "₹";
  productDetails: any;
  interestPayble: number = 0;
  totalPayableAmmount: number = 0;
  emiAmount: any = 0;
  interestDetails: any;
  otherUserInfo: any;
  currency: any = "INR";
  interestRate: number = 10.1;
  valueChangesSubscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private loanApi: LoanService,
    private loanCalcService: LoanCalulationService,
    private tokenStore: TokenStorageService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.cleanCache();
    this.otherUserInfo = this.tokenStore.getUserOtherInfo();
    this.currency = this.otherUserInfo?.currency;
    const basisId = sessionStorage.getItem("loanBasisDetails");
    this.getProductDetails(JSON.parse(basisId).basisId);
    setTimeout(() => {
      this.buildForm();
    }, 500);
  }
  getProductDetails(basisId) {
    this.loanApi.getProductAspectDetails(basisId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.productDetails = resp.data[0].lendingParameters.find(
          (el) => el.currency == this.otherUserInfo.currency
        );
        this.min = this.productDetails.minimumAmount;
        this.max = this.productDetails.maximumAmount;
        this.maxValue =
          this.interestRate + this.productDetails?.maxRateVariancePercentage ??
          0;
        this.minValue = Math.abs(
          this.interestRate - this.productDetails?.minRateVariancePercentage ??
            0
        );
      }
    });

    this.loanApi.getProductInterestDetails(basisId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        resp.data.forEach((item) => {
          if (item?.isPrimary) {
            this.interestDetails = item;
          }
        });
      }
    });
  }
  onSliderChange(e) {
    this.ammountValue = e.srcElement.ariaValueText;
    console.log(e.srcElement.ariaValueText);
    if (
      Number(this.ammountValue) == 0 ||
      Number(this.ammountValue) < this.min
    ) {
      this.loanForm.get("amount").setValue(this.min);
      return;
    }
    this.loanForm.get("amount").setValue(e.srcElement.ariaValueText);
  }

  ngOnDestroy(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.loanForm = this.fb.group({
      amount: [this.min],
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      interestRate: [this.interestRate, [Validators.required]]
    });

    this.valueChangesSubscription = this.loanForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((_) => {
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
            parseInt(this.loanForm.value.tenureDays) || 0
          ).then((result) => {
            const payload = {
              principleAmount: parseInt(this.loanForm.value.amount),
              interestRate: parseFloat(this.loanForm.value.interestRate),
              numberOfMonths: result,
              firstRepaymentDate: moment(new Date()).format("DD-MM-YYYY")
            };
            this.loanApi.getEmiCalculation(payload).subscribe((resp: any) => {
              this.interestPayble = Math.round(resp.data.totalInterest);
              this.totalPayableAmmount = Math.round(
                resp.data.totalRepaymentAmount
              );
              this.emiAmount = Math.round(resp.data.monthlyPayment);
            });
          });
        }
      });
  }
  calculateTenure(years, months, days) {
    return new Promise((resolve, reject) => {
      const totalMonths = years * 12 + months;
      const daysInMonth = days ? Math.ceil(days / 30) : 0;
      const totalMonthsIncludingDays = totalMonths + daysInMonth;
      console.log(totalMonthsIncludingDays);
      resolve(totalMonthsIncludingDays);
    });
  }
  get checkTenurePresence() {
    const { tenureYear, tenureMonth, tenureDays } = this.loanForm.value;
    const isTenurePresent = !!tenureYear || !!tenureMonth || !!tenureDays;
    return isTenurePresent;
  }

  applyForLoan() {
    this.loanForm.markAllAsTouched();
    if (
      this.loanForm.invalid ||
      !this.checkTenurePresence ||
      this.validateMinimumTenure ||
      this.validateTenure
    ) {
      return;
    }
    sessionStorage.setItem("tenureDays", this.loanForm.value.tenureDays);
    sessionStorage.setItem("tenureYear", this.loanForm.value.tenureYear);
    sessionStorage.setItem("tenureMonth", this.loanForm.value.tenureMonth);
    const obj = {
      ...this.loanForm.value,
      interestPayable: this.interestPayble,
      totalPayableAmount: this.totalPayableAmmount,
      emiAmount: this.emiAmount
    };
    this.customCalculatorValues.emit(obj);
    this.loanForm.reset();
  }

  calculateTotalDays(loanTenureYear, loanTenureMonth, loanTenureDay) {
    const d = +loanTenureYear * 365 + +loanTenureMonth * 30 + +loanTenureDay;
    return d;
  }

  get validateMinimumTenure() {
    let totalDays = this.calculateTotalDays(
      this.loanForm.value.tenureYear || 0,
      this.loanForm.value.tenureMonth || 0,
      this.loanForm.value.tenureDays || 0
    );
    let MinimumAllowedDays = this.calculateTotalDays(
      this.productDetails?.minimumTenorYear || 0,
      this.productDetails?.minimumTenorMonth || 0,
      this.productDetails?.minimumTenorDay || 0
    );
    return totalDays <= MinimumAllowedDays;
  }

  get validateTenure() {
    let totalDays = this.calculateTotalDays(
      this.loanForm.value.tenureYear || 0,
      this.loanForm.value.tenureMonth || 0,
      this.loanForm.value.tenureDays || 0
    );
    let totalAllowedDays = this.calculateTotalDays(
      this.productDetails?.maximumTenorYear || 0,
      this.productDetails?.maximumTenorMonth || 0,
      this.productDetails?.maximumTenorDay || 0
    );
    return totalDays >= totalAllowedDays;
  }

  cleanCache() {
    sessionStorage.removeItem("userCustomerId");
    sessionStorage.removeItem("customerStageId");
    sessionStorage.removeItem("customerId");
    sessionStorage.removeItem("customerStageIds");
    sessionStorage.removeItem("originationId");
    sessionStorage.removeItem("otherDocScreenCode");
    this.dataService.removeChecklistDocument();
    this.dataService.removeDisbursementDetails();
  }
}
