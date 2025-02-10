import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistDocumentComponent } from './checklist-document.component';

describe('ChecklistDocumentComponent', () => {
  let component: ChecklistDocumentComponent;
  let fixture: ComponentFixture<ChecklistDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChecklistDocumentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChecklistDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
