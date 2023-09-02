import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdRdCalculatorComponent } from './fd-rd-calculator.component';

describe('FdRdCalculatorComponent', () => {
  let component: FdRdCalculatorComponent;
  let fixture: ComponentFixture<FdRdCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdRdCalculatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FdRdCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
