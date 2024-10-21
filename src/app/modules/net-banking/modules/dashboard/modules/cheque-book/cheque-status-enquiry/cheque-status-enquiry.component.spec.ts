import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeStatusEnquiryComponent } from './cheque-status-enquiry.component';

describe('ChequeStatusEnquiryComponent', () => {
  let component: ChequeStatusEnquiryComponent;
  let fixture: ComponentFixture<ChequeStatusEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeStatusEnquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeStatusEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
