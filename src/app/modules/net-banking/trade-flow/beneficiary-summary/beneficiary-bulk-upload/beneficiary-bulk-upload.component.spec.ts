import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryBulkUploadComponent } from './beneficiary-bulk-upload.component';

describe('BeneficiaryBulkUploadComponent', () => {
  let component: BeneficiaryBulkUploadComponent;
  let fixture: ComponentFixture<BeneficiaryBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiaryBulkUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiaryBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
