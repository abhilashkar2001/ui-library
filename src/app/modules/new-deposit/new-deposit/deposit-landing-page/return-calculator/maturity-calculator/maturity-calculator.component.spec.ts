import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityCalculatorComponent } from './maturity-calculator.component';

describe('MaturityCalculatorComponent', () => {
  let component: MaturityCalculatorComponent;
  let fixture: ComponentFixture<MaturityCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaturityCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
