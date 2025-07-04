import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorDialogComponent } from './calculator-dialog.component';

describe('CalculatorDialogComponent', () => {
  let component: CalculatorDialogComponent;
  let fixture: ComponentFixture<CalculatorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculatorDialogComponent]
    });
    fixture = TestBed.createComponent(CalculatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
