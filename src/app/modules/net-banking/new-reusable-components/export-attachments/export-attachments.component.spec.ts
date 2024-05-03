import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportAttachmentsComponent } from './export-attachments.component';

describe('ExportAttachmentsComponent', () => {
  let component: ExportAttachmentsComponent;
  let fixture: ComponentFixture<ExportAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
