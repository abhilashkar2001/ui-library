import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { LoanService } from "app/shared/services/loan/loan.service";
import { debounceTime } from "rxjs/operators";

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
  constructor(private fb: FormBuilder, private loanApi: LoanService) {}

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
