import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorsDocumentUploadComponent } from './directors-document-upload.component';

describe('DirectorsDocumentUploadComponent', () => {
  let component: DirectorsDocumentUploadComponent;
  let fixture: ComponentFixture<DirectorsDocumentUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectorsDocumentUploadComponent],
    });
    fixture = TestBed.createComponent(DirectorsDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
