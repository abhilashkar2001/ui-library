import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDocumentsComponent } from './other-documents.component';

describe('OtherDocumentsComponent', () => {
  let component: OtherDocumentsComponent;
  let fixture: ComponentFixture<OtherDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtherDocumentsComponent]
    });
    fixture = TestBed.createComponent(OtherDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
