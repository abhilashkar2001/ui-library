import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-common-emi-calculator",
  templateUrl: "./common-emi-calculator.component.html",
  styleUrls: ["./common-emi-calculator.component.scss"],
})
export class CommonEmiCalculatorComponent implements OnInit {
  max = 100000;
  min = 1000;
  ammountValue = 0;
  loanForm: FormGroup;
  @Input() fdName = "rdCalculator";
  @Output() customCalculatorValues = new EventEmitter<any>();
  amount = new FormControl("");
  email = new FormControl("");
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
      amount: [0, [Validators.required]],
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      interestRate: ["", [Validators.required]],
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
}
