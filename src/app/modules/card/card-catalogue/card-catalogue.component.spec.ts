import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCatalogueComponent } from './card-catalogue.component';

describe('CardCatalogueComponent', () => {
  let component: CardCatalogueComponent;
  let fixture: ComponentFixture<CardCatalogueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardCatalogueComponent],
    });
    fixture = TestBed.createComponent(CardCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
