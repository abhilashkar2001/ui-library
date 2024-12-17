import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hl-loan-emi-calculator',
  templateUrl: './hl-loan-emi-calculator.component.html',
  styleUrls: ['./hl-loan-emi-calculator.component.scss'],
})
export class HLLoanEmiCalculatorComponent implements OnInit {
  amount = 5000;
  min = 5000;
  max = 100000;
  step = 5;
  year = 1;
  months = 1;
  interestRate = 2.0;
  emiAmount = 0;
  totalAmount = 0;
  totalInterest = 0;

  constructor() {}

  ngOnInit(): void {}

  loanCalculation(event: any) {
    this.amount = event.value;
  }
}
