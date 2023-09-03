import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HLLoanEmiCalculatorComponent } from './hl-loan-emi-calculator.component';

describe('HLLoanEmiCalculatorComponent', () => {
  let component: HLLoanEmiCalculatorComponent;
  let fixture: ComponentFixture<HLLoanEmiCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HLLoanEmiCalculatorComponent]
    });
    fixture = TestBed.createComponent(HLLoanEmiCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
