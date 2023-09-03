import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCibilScoreComponent } from './card-cibil-score.component';

describe('CardCibilScoreComponent', () => {
  let component: CardCibilScoreComponent;
  let fixture: ComponentFixture<CardCibilScoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardCibilScoreComponent]
    });
    fixture = TestBed.createComponent(CardCibilScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
