import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillProcessingSummaryComponent } from './bill-processing-summary.component';

describe('BillProcessingSummaryComponent', () => {
  let component: BillProcessingSummaryComponent;
  let fixture: ComponentFixture<BillProcessingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillProcessingSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillProcessingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
