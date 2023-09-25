import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-home-loan-calculator",
  templateUrl: "./home-loan-calculator.component.html",
  styleUrls: ["./home-loan-calculator.component.scss"],
})
export class HomeLoanCalculatorComponent implements OnInit {
  loanToggled = "home";
  maxEmiAmount = 1000000;
  minEmiAmount = 5000;
  max = 100000;
  min = 1000;
  ammountValue = 0;
  emiAmountValue = 0;
  loanForm: FormGroup;
  hlBalanceForm: FormGroup;
  @Input() fdName = "rdCalculator";
  @Output() customCalculatorValues = new EventEmitter<any>();
  amount = new FormControl("");
  email = new FormControl("");
  thumbLabel: boolean = true;

  homeLoanInfo = {
    existingBankEmi: 50000,
    currentBankEmi: 1800,
    monthlyEmiSave: 237823,
    existingBankAmountPaid: 1200300,
    currentBankAmountPaid: 347628,
    totalSave: 238722336,
  };
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildHlForm();
    this.buildLoanForm();
  }
  onSliderChange(e) {
    console.log(e);
    this.ammountValue = e.value;
    this.loanForm.get("amount").setValue(e.value);
    console.log(this.loanForm.value);
  }
  onEmiSliderChange(e) {
    this.emiAmountValue = e.value;
    this.hlBalanceForm.get("emiAmountValue").setValue(e.value);
  }
  onOutstandingSliderChange(e) {
    //this.emiAmountValue = e.value;
    this.hlBalanceForm.get("outstandingAmount").setValue(e.value);
  }
  buildLoanForm() {
    this.loanForm = this.fb.group({
      amount: 0,
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      interestRate: "",
    });
  }

  buildHlForm() {
    this.hlBalanceForm = this.fb.group({
      amount: 0,
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      interestRate: "",
      emiAmountValue: 0,
      outstandingAmount: 0,
    });
  }
  updateDeposit() {
    console.log(this.loanForm.value);
  }
  applyForLoan() {
    console.log(this.loanForm.value);
    sessionStorage.setItem("tenureDays", this.loanForm.value.tenureDays);
    sessionStorage.setItem("tenureYear", this.loanForm.value.tenureYear);
    sessionStorage.setItem("tenureMonth", this.loanForm.value.tenureMonth);
    this.customCalculatorValues.emit(this.loanForm.value);
  }
}
