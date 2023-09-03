import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hl-loan-emi-calculator',
  templateUrl: './hl-loan-emi-calculator.component.html',
  styleUrls: ['./hl-loan-emi-calculator.component.scss']
})
export class HLLoanEmiCalculatorComponent implements OnInit {
  amount: number = 5000;
  min: number = 5000;
  max: number = 100000;
  step: number = 5;
  year: number = 1;
  months: number = 1;
  interestRate: number = 2.0;
  emiAmount: number = 0;
  totalAmount: number = 0;
  totalInterest: number = 0;

  constructor() {

  }

  ngOnInit(): void {

  }

  loanCalculation(event: any) {
    this.amount = event.value;
  }

}
