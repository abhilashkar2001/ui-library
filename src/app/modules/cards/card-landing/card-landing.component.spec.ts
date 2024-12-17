import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLandingComponent } from './card-landing.component';

describe('CardLandingComponent', () => {
  let component: CardLandingComponent;
  let fixture: ComponentFixture<CardLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
