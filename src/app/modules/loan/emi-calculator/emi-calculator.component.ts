import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoanService } from 'app/shared/services/loan/loan.service';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ICalculatorReqeust } from '../../../shared/models/loan/calculator.model';
import { Location } from '@angular/common';
import { ProductState } from '../../../shared/models/router-state.model';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss'],
})
export class EmiCalculatorComponent implements OnInit {
  // 🟡 From stashed changes
  customerCategoryList: any[] = [
    { id: 1, values: 'SME' },
    { id: 2, values: 'MSME' },
  ];
  principalAmount = 0;
  interestAmount = 0;
  totalAmount = 0;
  emiFormGroup!: FormGroup;
  productCode: string | undefined;
  monthlyEmiPayment = 0;
  currencySymbol = '₹';

  // 🔵 From pulled changes
  calculatorForm:
    | FormGroup<{
        [K in keyof ICalculatorReqeust]: FormControl<ICalculatorReqeust[K]>;
      }>
    | undefined;

  private productId: number;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private _location: Location,
    private nonNullableFb: NonNullableFormBuilder,
  ) {
    // pulled change
    this.productId = (<ProductState>this._location.getState()).productId;
    this.initCalculatorForm();
  }

  ngOnInit(): void {
    this.getProductDetails(); // from pulled
    this.fetchCustomerCategories(); // from stashed
    this.buildEmiForm(); // from stashed
  }

  // 🔁 STASHED
  buildEmiForm() {
    this.emiFormGroup = this.fb.group({
      loanAmount: [0],
      tenure: [25],
      customerCategory: [null],
      isMonths: [true],
    });
  }

  fetchCustomerCategories() {
    if (!this.productCode) return;
    this.loanService
      .fetchCustomerCategories(this.productCode)
      .subscribe((res) => {
        this.customerCategoryList = res?.data;
      });
  }

  setTenureUnit(isMonths: boolean) {
    this.emiFormGroup.patchValue({ isMonths });
  }

  // 🔁 PULLED
  initCalculatorForm() {
    this.calculatorForm = this.nonNullableFb.group({
      principleAmount: [0, Validators.required],
      interestRate: [0, Validators.required],
      numberOfMonths: [0, Validators.required],
      firstRepaymentDate: ['', Validators.required],
    });
  }

  getProductDetails() {
    this.loanService
      .getProductAspectDetails(this.productId)
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          // handle response
        }
      });
  }
}
