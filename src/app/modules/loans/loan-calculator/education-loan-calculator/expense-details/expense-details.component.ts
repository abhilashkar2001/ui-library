import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { EducationLoan } from "../education-calculator.constant";
import { EducationCalculatorService } from "../education-calculator.service";

@Component({
  selector: "app-expense-details",
  templateUrl: "./expense-details.component.html",
  styleUrls: ["./expense-details.component.scss"]
})
export class ExpenseDetailsComponent implements OnInit {
  max = 100000;
  min = 1000;
  minMonth = EducationLoan.COURSE_DURATION.minDuration;
  maxMonth = EducationLoan.COURSE_DURATION.maxDuration;
  minTutionFee = EducationLoan.TUTION_FEES.minTutionFee;
  maxTutionFee = EducationLoan.TUTION_FEES.maxTutionFee;
  ammountValue = 0;
  loanForm!: FormGroup | any;
  @Input() fdName = "rdCalculator";
  @Output() customCalculatorValues = new EventEmitter<any>();
  amount = new FormControl("");
  email = new FormControl("");
  thumbLabel: boolean | any = true;
  constructor(
    private fb: FormBuilder,
    private educationApi: EducationCalculatorService
  ) {}

  ngOnInit(): void {
    this.educationApi.getExpenseDetails().subscribe((resp) => {
      if (resp?.amount) {
        this.buildForm(resp);
      } else {
        this.buildForm();
      }
    });
  }
  onSliderChange(e: any) {
    console.log(e);
    this.ammountValue = e.value;
    this.loanForm.get("amount").setValue(e.value);
  }
  onCostOfLivingChange(e: any) {
    this.loanForm.get("costOfLiving").setValue(e.value);
  }
  onTutionFeeChange(e: any) {
    this.loanForm.get("tutionFee").setValue(e.value);
  }
  buildForm(data?: any) {
    this.loanForm = this.fb.group({
      amount: [data ? data?.amount : 0],
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      interestRate: "",
      costOfLiving: [data ? data?.costOfLiving : 0],
      tutionFee: [data ? data?.tutionFee : 0]
    });
  }

  applyForLoan() {
    console.log(this.loanForm.value);
    this.educationApi.setExpenseDetails(this.loanForm.value);
    this.customCalculatorValues.emit(this.loanForm.value);
  }

  formatDurationLabel(value: number) {
    return `${value} Months`;
  }
  formatFeesLabel(value: any) {
    return `₹ ${value}`;
  }
  formatCostOFLabel(value: any) {
    return `₹ ${value}`;
  }
}
