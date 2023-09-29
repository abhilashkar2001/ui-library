import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { EducationLoan } from "../education-calculator.constant";

@Component({
  selector: "app-know-your-emi",
  templateUrl: "./know-your-emi.component.html",
  styleUrls: ["./know-your-emi.component.scss"],
})
export class KnowYourEmiComponent implements OnInit {
  max = EducationLoan.REQUIRED_LOAN.maxLoan;
  min = EducationLoan.REQUIRED_LOAN.minLoan;
  ammountValue = 0;
  loanForm: FormGroup;
  @Output() customCalculatorValues = new EventEmitter<any>();
  @Output() customBack = new EventEmitter<any>();

  thumbLabel: boolean = true;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }
  onSliderChange(e) {
    console.log(e);
    this.ammountValue = e.value;
    this.loanForm.get("amount").setValue(e.value);
    console.log(this.loanForm.value);
  }
  buildForm() {
    this.loanForm = this.fb.group({
      amount: 0,
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      interestRate: "",
      repaymentOption: "Complete Moratorium",
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
  formatLoanLabel(value) {
    return `₹ ${value}`;
  }
  onBack() {
    console.log("back");
    this.customBack.emit();
  }
}
