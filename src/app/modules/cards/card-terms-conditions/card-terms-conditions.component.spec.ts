import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTermsConditionsComponent } from './card-terms-conditions.component';

describe('CardTermsConditionsComponent', () => {
  let component: CardTermsConditionsComponent;
  let fixture: ComponentFixture<CardTermsConditionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardTermsConditionsComponent]
    });
    fixture = TestBed.createComponent(CardTermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
