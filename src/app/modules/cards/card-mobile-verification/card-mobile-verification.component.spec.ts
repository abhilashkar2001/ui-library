import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMobileVerificationComponent } from './card-mobile-verification.component';

describe('CardMobileVerificationComponent', () => {
  let component: CardMobileVerificationComponent;
  let fixture: ComponentFixture<CardMobileVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardMobileVerificationComponent],
    });
    fixture = TestBed.createComponent(CardMobileVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
