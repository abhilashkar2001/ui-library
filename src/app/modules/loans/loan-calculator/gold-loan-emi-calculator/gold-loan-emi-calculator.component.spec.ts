import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldLoanEmiCalculatorComponent } from './gold-loan-emi-calculator.component';

describe('GoldLoanEmiCalculatorComponent', () => {
  let component: GoldLoanEmiCalculatorComponent;
  let fixture: ComponentFixture<GoldLoanEmiCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoldLoanEmiCalculatorComponent],
    });
    fixture = TestBed.createComponent(GoldLoanEmiCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
