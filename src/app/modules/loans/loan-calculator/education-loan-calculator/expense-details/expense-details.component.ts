import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { EducationLoan } from "../education-calculator.constant";
import { MatLegacySlider as MatSlider } from "@angular/material/legacy-slider";
import { EducationCalculatorService } from "../education-calculator.service";

@Component({
  selector: "app-expense-details",
  templateUrl: "./expense-details.component.html",
  styleUrls: ["./expense-details.component.scss"],
})
export class ExpenseDetailsComponent implements OnInit {
  max = 100000;
  min = 1000;
  minMonth = EducationLoan.COURSE_DURATION.minDuration;
  maxMonth = EducationLoan.COURSE_DURATION.maxDuration;
  minTutionFee = EducationLoan.TUTION_FEES.minTutionFee;
  maxTutionFee = EducationLoan.TUTION_FEES.maxTutionFee;
  ammountValue = 0;
  loanForm: FormGroup;
  @Input() fdName = "rdCalculator";
  @Output() customCalculatorValues = new EventEmitter<any>();
  amount = new FormControl("");
  email = new FormControl("");
  thumbLabel: boolean = true;
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
  onSliderChange(e) {
    console.log(e);
    this.ammountValue = e.value;
    this.loanForm.get("amount").setValue(e.value);
  }
  onCostOfLivingChange(e) {
    this.loanForm.get("costOfLiving").setValue(e.value);
  }
  onTutionFeeChange(e) {
    this.loanForm.get("tutionFee").setValue(e.value);
  }
  buildForm(data?) {
    this.loanForm = this.fb.group({
      amount: [data ? data?.amount : 0],
      tenureYear: "",
      tenureMonth: "",
      tenureDays: "",
      interestRate: "",
      costOfLiving: [data ? data?.costOfLiving : 0],
      tutionFee: [data ? data?.tutionFee : 0],
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
  formatFeesLabel(value) {
    return `₹ ${value}`;
  }
  formatCostOFLabel(value) {
    return `₹ ${value}`;
  }
}
