import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLandingComponent } from './card-landing.component';

describe('CardLandingComponent', () => {
  let component: CardLandingComponent;
  let fixture: ComponentFixture<CardLandingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardLandingComponent]
    });
    fixture = TestBed.createComponent(CardLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
