import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getFirstRepaymentDate } from 'app/shared/helpers/utils';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { SidenavService } from 'app/shared/services/sidenav.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-emi-calculator-drawer',
  templateUrl: './emi-calculator-drawer.component.html',
  styleUrls: ['./emi-calculator-drawer.component.scss'],
})
export class EmiCalculatorDrawerComponent implements OnInit {
  calculatorForm!: FormGroup;
  principalAmount = 0;
  currencySymbol = '₹';
  monthlyEmiPayment = 0;
  interestAmount = 0;
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private sideNavService: SidenavService,
    private loanService: LoanService,
  ) {}
  ngOnInit(): void {
    this.buildCalculatorForm();
  }
  buildCalculatorForm() {
    this.calculatorForm = this.fb.group({
      loanAmount: [0, Validators.required],
      loanTenureDay: [0, Validators.required],
      loanTenureMonth: [0, Validators.required],
      loanTenureYear: [0, Validators.required],

      interestRate: [0, Validators.required],
    });
    this.calculatorForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((res) => {
        this.calculateEmi(res.loanAmount);
      });
  }
  calculateTenure(years: number, months: number, days: number): number {
    years = Number(years) || 0;
    months = Number(months) || 0;
    days = Number(days) || 0;
    const totalMonths = years * 12 + months;
    const daysInMonth = days ? Math.ceil(days / 30) : 0;
    const totalMonthsIncludingDays = totalMonths + daysInMonth;
    return totalMonthsIncludingDays;
  }
  private calculateEmi(loanAmount: number): void {
    const formValue = this.calculatorForm.value;
    const tenure = this.calculateTenure(
      formValue.loanTenureYear,
      formValue.loanTenureMonth,
      formValue.loanTenureDay,
    );
    if (
      !loanAmount ||
      !tenure ||
      !this.calculatorForm.get('interestRate')?.value
    )
      return;
    this.loanService
      .getEmiCalculation({
        principleAmount: loanAmount,
        interestRate: this.calculatorForm.get('interestRate')?.value,
        numberOfMonths: tenure,
        firstRepaymentDate: getFirstRepaymentDate(),
      })
      .subscribe((res: any) => {
        console.log('EMI response', res);
        this.monthlyEmiPayment = res.data?.monthlyPayment;
        this.principalAmount = res.data?.principal;
        this.interestAmount = res.data?.totalInterest;
        this.totalAmount = res.data?.totalRepaymentAmount;
      });
  }
  closeDrawer() {
    this.sideNavService.close();
  }
}
