import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPersonalDetailsComponent } from './card-personal-details.component';

describe('CardPersonalDetailsComponent', () => {
  let component: CardPersonalDetailsComponent;
  let fixture: ComponentFixture<CardPersonalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardPersonalDetailsComponent]
    });
    fixture = TestBed.createComponent(CardPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
