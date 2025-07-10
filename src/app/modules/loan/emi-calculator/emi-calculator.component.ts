import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ICalculatorReqeust } from '../../../shared/models/loan/calculator.model';
import { LoanService } from '../../../shared/services/loan/loan.service';
import { Location } from '@angular/common';
import { ProductState } from '../../../shared/models/router-state.model';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss'],
})
export class EmiCalculatorComponent implements OnInit {
  calculatorForm:
    | FormGroup<{
        [K in keyof ICalculatorReqeust]: FormControl<ICalculatorReqeust[K]>;
      }>
    | undefined;

  private productId: number;

  constructor(
    private fb: NonNullableFormBuilder,
    private loanService: LoanService,
    private _location: Location,
  ) {
    this.productId = (<ProductState>this._location.getState()).productId;
    this.initCalculatorForm();
  }

  ngOnInit() {
    this.getProductDetails();
  }

  initCalculatorForm() {
    this.calculatorForm = this.fb.group({
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
        }
      });
  }
}
