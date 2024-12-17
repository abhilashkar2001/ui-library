import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationLoanCalculatorComponent } from './education-loan-calculator.component';

describe('EducationLoanCalculatorComponent', () => {
  let component: EducationLoanCalculatorComponent;
  let fixture: ComponentFixture<EducationLoanCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EducationLoanCalculatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationLoanCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
