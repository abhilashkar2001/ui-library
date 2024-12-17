import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBulkUploadComponent } from './upload-bulk-upload.component';

describe('UploadBulkUploadComponent', () => {
  let component: UploadBulkUploadComponent;
  let fixture: ComponentFixture<UploadBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadBulkUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
