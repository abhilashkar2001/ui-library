import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEmiCalculatorComponent } from './common-emi-calculator.component';

describe('CommonEmiCalculatorComponent', () => {
  let component: CommonEmiCalculatorComponent;
  let fixture: ComponentFixture<CommonEmiCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonEmiCalculatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonEmiCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
