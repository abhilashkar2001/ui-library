import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { LoanService } from "app/shared/services/loan/loan.service";
import { debounceTime } from "rxjs/operators";
import { LoanCalulationService } from "../loan-calculation.service";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-common-emi-calculator",
  templateUrl: "./common-emi-calculator.component.html",
  styleUrls: ["./common-emi-calculator.component.scss"],
})
export class CommonEmiCalculatorComponent implements OnInit {
  max = 1000000;
  min = 10000;
  ammountValue = 0;
  loanForm: FormGroup;
  @Input() fdName = "rdCalculator";
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
  constructor(
    private fb: FormBuilder,
    private loanApi: LoanService,
    private loanCalcService: LoanCalulationService,
    private tokenStore: TokenStorageService
  ) {}

  ngOnInit(): void {
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
    console.log(e);
    this.ammountValue = e.value;
    this.loanForm.get("amount").setValue(e.value);
    console.log(this.loanForm.value);
  }
  buildForm() {
    this.loanForm = this.fb.group({
      amount: [this.min],
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      interestRate: [1, [Validators.required]],
    });

    this.loanForm
      .get("amount")
      .valueChanges.pipe(debounceTime(500))
      .subscribe((resp) => {
        console.log(resp);
        if (parseInt(resp) == 0 || resp < this.min) {
          this.loanForm.get("amount").setValue(this.min);
        }
      });

    this.loanForm.valueChanges.pipe(debounceTime(500)).subscribe((_) => {
      if (
        this.loanForm.value.interestRate &&
        this.loanForm.value.amount &&
        (this.loanForm.value.tenureYear ||
          this.loanForm.value.tenureMonth ||
          this.loanForm.value.tenureDays)
      ) {
        this.loanCalcService
          .calculateAmortize(
            parseInt(this.loanForm.value.amount),
            parseInt(this.loanForm.value.interestRate),
            parseInt(this.loanForm.value.tenureYear) || 0,
            parseInt(this.loanForm.value.tenureMonth) || 0,
            parseInt(this.loanForm.value.tenureDays) || 0
          )
          .then((value) => {
            const finalInterest = value.monthlyInterestArr[0].interestComponent
              .toFixed(2)
              .split(".");

            this.interestPayble = Math.abs(
              value.totalPayableAmount - this.loanForm.value.amount
            );
            this.totalPayableAmmount = value.totalPayableAmount;
            this.emiAmount = Math.round(value.emiAmount);
          });
      }
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
      emiAmount: this.emiAmount,
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
}
