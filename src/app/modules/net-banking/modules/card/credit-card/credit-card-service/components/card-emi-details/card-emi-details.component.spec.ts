import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEmiDetailsComponent } from './card-emi-details.component';

describe('CardEmiDetailsComponent', () => {
  let component: CardEmiDetailsComponent;
  let fixture: ComponentFixture<CardEmiDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardEmiDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardEmiDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
