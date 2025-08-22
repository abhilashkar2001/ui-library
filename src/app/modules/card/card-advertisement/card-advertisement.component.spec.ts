import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAdvertisementComponent } from './card-advertisement.component';

describe('CardAdvertisementComponent', () => {
  let component: CardAdvertisementComponent;
  let fixture: ComponentFixture<CardAdvertisementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardAdvertisementComponent]
    });
    fixture = TestBed.createComponent(CardAdvertisementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
