import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreShipmentLPSummaryComponent } from './pre-shipment-lp-summary.component';

describe('PreShipmentLPSummaryComponent', () => {
  let component: PreShipmentLPSummaryComponent;
  let fixture: ComponentFixture<PreShipmentLPSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreShipmentLPSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreShipmentLPSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
