import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnCalculatorComponent } from './return-calculator.component';

describe('ReturnCalculatorComponent', () => {
  let component: ReturnCalculatorComponent;
  let fixture: ComponentFixture<ReturnCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
