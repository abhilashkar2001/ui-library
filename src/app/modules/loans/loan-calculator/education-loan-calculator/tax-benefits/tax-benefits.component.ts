import { Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EducationCalculatorService } from '../education-calculator.service';

@Component({
  selector: 'app-tax-benefits',
  templateUrl: './tax-benefits.component.html',
  styleUrls: ['./tax-benefits.component.scss'],
})
export class TaxBenefitsComponent implements OnInit {
  min = 5000;
  max = 100000;
  rangeValues: number[] = [20, 80];
  ammountValue = 0;
  loanForm!: FormGroup | any;
  @Output() customCalculatorValues = new EventEmitter<any>();
  @Output() customBack = new EventEmitter<any>();
  thumbLabel: boolean | any = true;
  value = 8000;
  highValue = 60000;
  options: Options = {
    floor: 5000,
    ceil: 100000,
    translate: (value: number): string => {
      return `₹ ${value}`;
    },
  };
  expenseDetails: any;
  constructor(
    private fb: FormBuilder,
    private educationApi: EducationCalculatorService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    // this.calCulateGauge();
    this.getExpenseDetails();
  }
  getExpenseDetails() {
    this.educationApi.getExpenseDetails().subscribe((resp) => {
      this.expenseDetails = resp;
      const tutionFeePercent =
        (this.expenseDetails?.tutionFee * 100) /
        (this.expenseDetails?.tutionFee + this.expenseDetails?.costOfLiving) /
        100;
      this.calCulateGauge(tutionFeePercent);
      console.log(
        tutionFeePercent,
        'expenseDetails?.tutionFee + expenseDetails?.costOfLiving',
      );
    });
  }
  onSliderChange(e: any) {
    console.log(e);
    this.ammountValue = e.value;
    this.loanForm.get('requiredLoan').setValue(e.value);
    console.log(this.loanForm.value);
  }
  buildForm() {
    this.loanForm = this.fb.group({
      amount: `${this.value}-${this.highValue}`,
      tenureYear: '',
      tenureMonth: '',
      tenureDays: '',
      interestRate: '',
      requiredLoan: '',
    });
  }
  updateDeposit() {
    console.log(this.loanForm.value);
  }
  applyForLoan() {
    this.customCalculatorValues.emit(this.loanForm.value);
  }
  formatLoanLabel(value: any) {
    return `₹ ${value}`;
  }
  setGaugeValue(gauge: any, value: any) {
    if (value < 0 || value > 1) {
      return;
    }

    if (gauge)
      gauge.querySelector('.gauge__fill').style.transform = `rotate(${
        value / 2
      }turn)`;
  }

  calCulateGauge(percent: any) {
    const gaugeElement = document.querySelector('.gauge');
    this.setGaugeValue(gaugeElement, percent);
  }
  onValueChange(e: any) {
    console.log(e);
    this.loanForm.get('amount').setValue(`${e.value}-${e.highValue}`);
  }
  onBack() {
    this.customBack.emit();
  }
}
