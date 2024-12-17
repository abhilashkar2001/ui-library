import { Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-normal-loan-emi-calculator',
  templateUrl: './normal-loan-emi-calculator.component.html',
  styleUrls: ['./normal-loan-emi-calculator.component.scss'],
})
export class NormalLoanEmiCalculatorComponent implements OnInit {
  @Output() loanAmountDetailsEvent: EventEmitter<any> = new EventEmitter();
  disabled = false;
  max = 100000;
  min = 5000;
  showTicks = false;
  step = 5;
  thumbLabel = true;
  principlAmount = this.min;
  interestRate = 2.0;
  year = 1;
  months = 1;
  days = 0;
  totalInterest = 0;
  totalAmount = 0;
  emiAmount: any = 0;

  ngOnInit(): void {
    this.loanCalculation(this.min);
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  loanCalculation(event: any) {
    this.principlAmount = event.value ? event.value : this.min;
    const totalMonths = Number(this.year) * 12 + Number(this.months);
    this.totalInterest = Number(
      (
        (this.principlAmount * (this.interestRate * 0.01)) /
        totalMonths
      ).toFixed(2),
    );
    this.totalAmount = Number(
      (this.principlAmount / totalMonths + this.totalInterest).toFixed(2),
    );
    this.emiAmount = Number(
      (this.principlAmount / totalMonths + this.totalInterest).toFixed(2),
    );
    this.loanAmountDetailsEvent.emit({
      principlAmount: this.principlAmount,
      interestRate: this.interestRate,
      totalPayableAmount: this.totalAmount,
      emiAmount: this.emiAmount,
      totalInterestPayble: this.totalInterest,
      minAmount: this.min,
      maxAmount: this.max,
      tenure: {
        day: this.days,
        months: this.months,
        years: this.year,
      },
    });
  }
}
