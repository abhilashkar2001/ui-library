import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCycleComponent } from './billing-cycle.component';

describe('BillingCycleComponent', () => {
  let component: BillingCycleComponent;
  let fixture: ComponentFixture<BillingCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingCycleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
