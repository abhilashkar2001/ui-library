import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home-loan-calculator',
  templateUrl: './home-loan-calculator.component.html',
  styleUrls: ['./home-loan-calculator.component.scss'],
})
export class HomeLoanCalculatorComponent implements OnInit {
  loanToggled = 'home';
  maxEmiAmount = 1000000;
  minEmiAmount = 5000;
  max = 100000;
  min = 1000;
  ammountValue = 0;
  emiAmountValue = 0;
  loanForm!: FormGroup | any;
  hlBalanceForm!: FormGroup | any;
  @Input() fdName = 'rdCalculator';
  @Output() customCalculatorValues = new EventEmitter<any>();
  amount = new FormControl('');
  email = new FormControl('');
  thumbLabel: boolean | any = true;

  homeLoanInfo = {
    existingBankEmi: 50000,
    currentBankEmi: 1800,
    monthlyEmiSave: 237823,
    existingBankAmountPaid: 1200300,
    currentBankAmountPaid: 347628,
    totalSave: 238722336,
  };
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildHlForm();
    this.buildLoanForm();
  }
  onSliderChange(e: any) {
    console.log(e);
    this.ammountValue = e.value;
    this.loanForm.get('amount').setValue(e.value);
    console.log(this.loanForm.value);
  }
  onEmiSliderChange(e: any) {
    this.emiAmountValue = e.value;
    this.hlBalanceForm.get('emiAmountValue').setValue(e.value);
  }
  onOutstandingSliderChange(e: any) {
    //this.emiAmountValue = e.value;
    this.hlBalanceForm.get('outstandingAmount').setValue(e.value);
  }
  buildLoanForm() {
    this.loanForm = this.fb.group({
      amount: 0,
      tenureYear: '',
      tenureMonth: '',
      tenureDays: '',
      interestRate: '',
    });
  }

  buildHlForm() {
    this.hlBalanceForm = this.fb.group({
      amount: 0,
      tenureYear: '',
      tenureMonth: '',
      tenureDays: '',
      interestRate: '',
      emiAmountValue: 0,
      outstandingAmount: 0,
    });
  }
  applyForLoan() {
    this.customCalculatorValues.emit(this.loanForm.value);
  }
}
