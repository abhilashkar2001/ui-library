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
  constructor(
    private fb: FormBuilder,
    private loanApi: LoanService,
    private loanCalcService: LoanCalulationService
  ) {}

  ngOnInit(): void {
    const basisId = sessionStorage.getItem("loanBasisDetails");
    this.getProductDetails(JSON.parse(basisId).basisId);
    this.buildForm();
  }
  getProductDetails(basisId) {
    this.loanApi.getProductAspectDetails(basisId).subscribe((resp) => {
      if (resp?.statusCode === 200)
        this.productDetails = resp.data[0].lendingParameters[0];
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
      interestRate: [0, [Validators.required]],
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

            this.interestPayble = parseFloat(
              finalInterest[0] + "." + finalInterest[1].slice(0, 3)
            );
            this.totalPayableAmmount = value.totalPayableAmount;
            this.emiAmount = Math.round(value.emiAmount);
          });
      }
    });
  }
  updateDeposit() {
    console.log(this.loanForm.value);
  }
  applyForLoan() {
    if (this.loanForm.invalid) {
      this.loanForm.markAllAsTouched();
      return;
    }
    console.log(this.loanForm.value);
    sessionStorage.setItem("tenureDays", this.loanForm.value.tenureDays);
    sessionStorage.setItem("tenureYear", this.loanForm.value.tenureYear);
    sessionStorage.setItem("tenureMonth", this.loanForm.value.tenureMonth);
    this.customCalculatorValues.emit(this.loanForm.value);
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
