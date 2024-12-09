import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-gold-loan-emi-calculator",
  templateUrl: "./gold-loan-emi-calculator.component.html",
  styleUrls: ["./gold-loan-emi-calculator.component.scss"]
})
export class GoldLoanEmiCalculatorComponent implements OnInit {
  max = 100000;
  min = 1000;
  ammountValue = 0;
  loanForm!: FormGroup | any;
  amount = new FormControl("");
  email = new FormControl("");
  thumbLabel: boolean | any = true;
  @Input() fdName = "rdCalculator";
  @Output() customCalculatorValues = new EventEmitter<any>();
  constructor(private fb: FormBuilder) {}
  // amount: number = 5000;
  // min: number = 5000;
  // max: number = 100000;
  // step: number = 5;
  // year: number = 1;
  // months: number = 1;
  // interestRate: number = 2.0;
  // emiAmount: number = 0;
  // totalAmount: number = 0;
  // totalInterest: number = 0;

  ngOnInit(): void {
    this.buildForm();
  }

  onSliderChange(e: any) {
    this.ammountValue = e.srcElement.ariaValueText;
    this.loanForm.get("amount").setValue(e.srcElement.ariaValueText);
  }
  buildForm() {
    this.loanForm = this.fb.group({
      amount: 0,
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      ornaments: "",
      carat: "",
      weight: ""
    });
  }
  applyForLoan() {
    console.log(this.loanForm.value);
    sessionStorage.setItem("tenureDays", this.loanForm.value.tenureDays);
    sessionStorage.setItem("tenureYear", this.loanForm.value.tenureYear);
    sessionStorage.setItem("tenureMonth", this.loanForm.value.tenureMonth);
    this.customCalculatorValues.emit(this.loanForm.value);
  }
}
