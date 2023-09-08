import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDiverseComponent } from './card-diverse.component';

describe('CardDiverseComponent', () => {
  let component: CardDiverseComponent;
  let fixture: ComponentFixture<CardDiverseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardDiverseComponent]
    });
    fixture = TestBed.createComponent(CardDiverseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
