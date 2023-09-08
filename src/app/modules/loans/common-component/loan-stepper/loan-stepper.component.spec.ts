import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanStepperComponent } from './loan-stepper.component';

describe('LoanStepperComponent', () => {
  let component: LoanStepperComponent;
  let fixture: ComponentFixture<LoanStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanStepperComponent]
    });
    fixture = TestBed.createComponent(LoanStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
