import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalLoanEmiCalculatorComponent } from './normal-loan-emi-calculator.component';

describe('LoanEmiCalculatorComponent', () => {
  let component: NormalLoanEmiCalculatorComponent;
  let fixture: ComponentFixture<NormalLoanEmiCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NormalLoanEmiCalculatorComponent]
    });
    fixture = TestBed.createComponent(NormalLoanEmiCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
