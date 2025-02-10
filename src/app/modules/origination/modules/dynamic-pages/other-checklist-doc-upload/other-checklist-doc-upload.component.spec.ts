import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherChecklistDocUploadComponent } from './other-checklist-doc-upload.component';

describe('OtherChecklistDocUploadComponent', () => {
  let component: OtherChecklistDocUploadComponent;
  let fixture: ComponentFixture<OtherChecklistDocUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OtherChecklistDocUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OtherChecklistDocUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
