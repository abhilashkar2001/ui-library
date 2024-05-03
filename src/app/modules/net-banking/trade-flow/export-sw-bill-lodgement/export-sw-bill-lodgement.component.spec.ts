import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSWBillLodgementComponent } from './export-sw-bill-lodgement.component';

describe('ExportSWBillLodgementComponent', () => {
  let component: ExportSWBillLodgementComponent;
  let fixture: ComponentFixture<ExportSWBillLodgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportSWBillLodgementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportSWBillLodgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
