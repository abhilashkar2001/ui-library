import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardInternaltionalLimitComponent } from './credit-card-internaltional-limit.component';

describe('CreditCardInternaltionalLimitComponent', () => {
  let component: CreditCardInternaltionalLimitComponent;
  let fixture: ComponentFixture<CreditCardInternaltionalLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardInternaltionalLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardInternaltionalLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
