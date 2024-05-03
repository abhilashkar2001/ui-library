import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBillDispatchSummaryComponent } from './export-bill-dispatch-summary.component';

describe('ExportBillDispatchSummaryComponent', () => {
  let component: ExportBillDispatchSummaryComponent;
  let fixture: ComponentFixture<ExportBillDispatchSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportBillDispatchSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportBillDispatchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
