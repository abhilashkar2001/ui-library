import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRequestEnquiryComponent } from './payment-request-enquiry.component';

describe('PaymentRequestEnquiryComponent', () => {
  let component: PaymentRequestEnquiryComponent;
  let fixture: ComponentFixture<PaymentRequestEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRequestEnquiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRequestEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
