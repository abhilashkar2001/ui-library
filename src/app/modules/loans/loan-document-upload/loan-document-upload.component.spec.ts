import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDocumentUploadComponent } from './loan-document-upload.component';

describe('LoanDocumentUploadComponent', () => {
  let component: LoanDocumentUploadComponent;
  let fixture: ComponentFixture<LoanDocumentUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanDocumentUploadComponent]
    });
    fixture = TestBed.createComponent(LoanDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
