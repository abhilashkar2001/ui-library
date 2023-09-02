import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdCalculatorComponent } from './rd-calculator.component';

describe('RdCalculatorComponent', () => {
  let component: RdCalculatorComponent;
  let fixture: ComponentFixture<RdCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
