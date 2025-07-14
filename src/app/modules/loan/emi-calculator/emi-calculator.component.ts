import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { debounceTime, Subscription } from 'rxjs';
import { LoanService } from 'app/shared/services/loan/loan.service';
import {
  SidenavService,
  ContainerContextData,
} from 'app/shared/services/sidenav.service';
import { EmiCalculatorDrawerComponent } from './emi-calculator-drawer/emi-calculator-drawer.component';
import { ProductState } from 'app/shared/models/router-state.model';
import { getFirstRepaymentDate } from 'app/shared/helpers/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss'],
})
export class EmiCalculatorComponent implements OnInit, OnDestroy {
  emiFormGroup!: FormGroup;

  customerCategoryList: any[] = [];
  interestRate = 0;
  monthlyEmiPayment = 0;
  currentLoanName = '';
  basisCode = '';
  minimumTenorYear = 0;
  maximumTenorYear = 0;
  minTenorMonth = 0;
  minimumTenorMonth = 0;
  maximumTenorMonth = 0;
  minimumAmount = 0;
  maximumAmount = 0;
  // results of calcc
  principalAmount = 0;
  totalAmount = 0;
  interestAmount = 0;
  private productId: number;
  private subscriptions: Subscription[] = [];
  currencySymbol = '₹';
  amountValue: any = 0;
  thumbLabel = this.amountValue;
  constructor(
    private loanService: LoanService,
    private fb: NonNullableFormBuilder,
    private location: Location,
    public sidenavService: SidenavService,
    private router: Router,
  ) {
    const state = this.location.getState() as ProductState;
    this.productId = state?.productId;
    this.currentLoanName = state?.selectedLoan?.basisName;
    this.basisCode = state?.selectedLoan?.basisCode;
  }

  ngOnInit(): void {
    this.buildForm();
    this.getProductDetails();
    this.fetchCustomerCategories();
    this.initSubscriptions();
  }
  buildForm() {
    this.emiFormGroup = this.fb.group({
      loanAmount: [0],
      tenure: [25],
      customerCategory: [null],
      isMonths: [true],
    });
  }
  private initSubscriptions(): void {
    const form = this.emiFormGroup;

    this.subscriptions.push(
      form.valueChanges.pipe(debounceTime(300)).subscribe((formValue: any) => {
        const { loanAmount, customerCategory, tenure } = formValue;

        if (loanAmount > 0 && customerCategory) {
          this.fetchInterestRate(customerCategory, loanAmount);
        }

        if (loanAmount > 0 && tenure > 0 && this.interestRate > 0) {
          this.calculateEmi(loanAmount, tenure);
        }
      }),
    );
  }

  private fetchCustomerCategories(): void {
    if (!this.basisCode) return;
    this.loanService
      .fetchCustomerCategories(this.basisCode)
      .subscribe((res) => {
        this.customerCategoryList = res?.data ?? [];
      });
  }

  private fetchInterestRate(category: string, amount: number): void {
    if (!category || !amount) return;
    this.loanService
      .fetchInterestRateForCustomerCategory(this.basisCode, category, amount)
      .subscribe((res) => {
        this.interestRate = res?.data ?? 0;
        this.calculateEmi(amount, this.emiFormGroup.get('tenure')?.value);
      });
  }

  private calculateEmi(loanAmount: number, tenure: number): void {
    if (this.emiFormGroup.get('isMonths')?.value === false) {
      tenure = tenure * 12;
    }
    this.loanService
      .getEmiCalculation({
        principleAmount: loanAmount,
        interestRate: this.interestRate,
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

  setTenureUnit(isMonths: boolean): void {
    this.emiFormGroup.patchValue({ isMonths });
  }

  openEmiCalculatorDrawer(): void {
    const contextData: ContainerContextData = {
      component: EmiCalculatorDrawerComponent,
      data: {
        loanAmount: this.emiFormGroup.get('loanAmount')?.value,
        interestRate: this.interestRate,
      },
    };
    this.sidenavService.open(contextData);
  }
  onSliderChange(e: any) {
    this.amountValue = e.srcElement.ariaValueText;
    console.log(e.srcElement.ariaValueText);
    if (
      Number(this.amountValue) == 0 ||
      Number(this.amountValue) < this.minimumAmount
    ) {
      this.emiFormGroup.get('loanAmount')?.setValue(this.minimumAmount);
      return;
    }
    this.emiFormGroup.get('loanAmount')?.setValue(e.srcElement.ariaValueText);
  }
  onYearSliderChange(e: any) {
    console.log(e.srcElement.ariaValueText);
    this.emiFormGroup.get('tenure')?.setValue(e.srcElement.ariaValueText);
  }
  getProductDetails(): void {
    this.loanService
      .getProductAspectDetails(this.productId)
      .subscribe((resp) => {
        const lending = resp?.data?.[0]?.lendingParameters?.[0];
        if (resp?.statusCode === 200 && lending) {
          this.minimumAmount = lending.minimumAmount ?? 0;
          this.maximumAmount = lending.maximumAmount ?? 0;
          this.minimumTenorYear = lending.minimumTenorYear ?? 0;
          this.maximumTenorYear = lending.maximumTenorYear ?? 0;
          this.minimumTenorMonth = lending.minimumTenorMonth ?? 0;
          this.maximumTenorMonth = lending.maximumTenorMonth ?? 0;
        }
      });
  }

  apply() {
    this.router.navigate(['/loan/login']);
  }
  goBack(): void {
    console.log('GO BACK');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
