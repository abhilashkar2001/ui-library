import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gold-loan-emi-calculator',
  templateUrl: './gold-loan-emi-calculator.component.html',
  styleUrls: ['./gold-loan-emi-calculator.component.scss']
})
export class GoldLoanEmiCalculatorComponent implements OnInit {
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

  ngOnInit(): void {

  }

  loanCalculation(event: any) {

  }

}
