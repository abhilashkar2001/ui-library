import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanOfferLetterComponent } from './loan-offer-letter.component';

describe('LoanOfferLetterComponent', () => {
  let component: LoanOfferLetterComponent;
  let fixture: ComponentFixture<LoanOfferLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanOfferLetterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
