import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenificiaryBulkUploadSummaryComponent } from './benificiary-bulk-upload-summary.component';

describe('BenificiaryBulkUploadSummaryComponent', () => {
  let component: BenificiaryBulkUploadSummaryComponent;
  let fixture: ComponentFixture<BenificiaryBulkUploadSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenificiaryBulkUploadSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenificiaryBulkUploadSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
