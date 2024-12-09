import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-expense-tax-benefit-calculator",
  templateUrl: "./expense-tax-benefit-calculator.component.html",
  styleUrls: ["./expense-tax-benefit-calculator.component.scss"]
})
export class ExpenseTaxBenefitCalculatorComponent implements OnInit {
  courseSlider: any = 12;
  disabled = false;
  max = 100000;
  min = 5000;
  showTicks = false;
  step: any = 5;
  thumbLabel = true;
  amount = this.min;
  interestRate: number = 2.0;
  year: number = 1;
  months: number = 1;
  totalInterest = 0;
  totalAmount = 0;
  emiAmount: any = 0;

  constructor() {}

  ngOnInit(): void {}

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + "K";
    }

    return `${value}`;
  }
}
