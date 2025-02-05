import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSelectKycComponent } from './card-select-kyc.component';

describe('CardSelectKycComponent', () => {
  let component: CardSelectKycComponent;
  let fixture: ComponentFixture<CardSelectKycComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardSelectKycComponent],
    });
    fixture = TestBed.createComponent(CardSelectKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
