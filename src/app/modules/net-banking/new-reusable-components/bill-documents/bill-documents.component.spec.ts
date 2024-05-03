import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDocumentsComponent } from './bill-documents.component';

describe('BillDocumentsComponent', () => {
  let component: BillDocumentsComponent;
  let fixture: ComponentFixture<BillDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
