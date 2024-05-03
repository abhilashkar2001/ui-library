import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAttachmentsComponent } from './bill-attachments.component';

describe('BillAttachmentsComponent', () => {
  let component: BillAttachmentsComponent;
  let fixture: ComponentFixture<BillAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillAttachmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
