import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { EducationLoan } from "../education-calculator.constant";
import { EducationCalculatorService } from "../education-calculator.service";

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
  constructor(
    private fb: FormBuilder,
    private educationApi: EducationCalculatorService
  ) {}

  ngOnInit(): void {
    this.educationApi.getEmiDetails().subscribe((resp) => {
      if (resp?.amount) {
        this.buildForm(resp);
      } else {
        this.buildForm();
      }
    });
  }
  onSliderChange(e) {
    console.log(e);
    this.ammountValue = e.value;
    this.loanForm.get("amount").setValue(e.value);
    console.log(this.loanForm.value);
  }
  buildForm(data?) {
    this.loanForm = this.fb.group({
      amount: [data ? data?.amount : 0],
      tenureYear: [data ? data?.tenureYear : 0],
      tenureMonth: [data ? data?.tenureMonth : 0],
      tenureDays: [data ? data?.tenureDays : 0],
      interestRate: [data ? data?.interestRate : 0],
      repaymentOption: [data ? data?.repaymentOption : "Complete Moratorium"],
    });
  }
  updateDeposit() {
    console.log(this.loanForm.value);
  }
  applyForLoan() {
    this.educationApi.setEmiDetails(this.loanForm.value);
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
