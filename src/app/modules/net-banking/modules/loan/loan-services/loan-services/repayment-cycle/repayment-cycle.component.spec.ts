import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentCycleComponent } from './repayment-cycle.component';

describe('RepaymentCycleComponent', () => {
  let component: RepaymentCycleComponent;
  let fixture: ComponentFixture<RepaymentCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepaymentCycleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepaymentCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
