import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgricultureEmiCalculatorComponent } from './agriculture-emi-calculator.component';

describe('AgricultureEmiCalculatorComponent', () => {
  let component: AgricultureEmiCalculatorComponent;
  let fixture: ComponentFixture<AgricultureEmiCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgricultureEmiCalculatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgricultureEmiCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
