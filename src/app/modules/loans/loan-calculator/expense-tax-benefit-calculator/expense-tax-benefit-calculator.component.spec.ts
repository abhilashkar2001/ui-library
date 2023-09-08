import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTaxBenefitCalculatorComponent } from './expense-tax-benefit-calculator.component';

describe('ExpenseTaxBenefitCalculatorComponent', () => {
  let component: ExpenseTaxBenefitCalculatorComponent;
  let fixture: ComponentFixture<ExpenseTaxBenefitCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseTaxBenefitCalculatorComponent]
    });
    fixture = TestBed.createComponent(ExpenseTaxBenefitCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
