import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkUploadComponent } from './add-bulk-upload.component';

describe('AddBulkUploadComponent', () => {
  let component: AddBulkUploadComponent;
  let fixture: ComponentFixture<AddBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBulkUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
