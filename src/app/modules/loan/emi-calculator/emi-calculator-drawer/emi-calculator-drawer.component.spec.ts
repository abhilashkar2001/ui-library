import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmiCalculatorDrawerComponent } from './emi-calculator-drawer.component';

describe('EmiCalculatorDrawerComponent', () => {
  let component: EmiCalculatorDrawerComponent;
  let fixture: ComponentFixture<EmiCalculatorDrawerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmiCalculatorDrawerComponent],
    });
    fixture = TestBed.createComponent(EmiCalculatorDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
