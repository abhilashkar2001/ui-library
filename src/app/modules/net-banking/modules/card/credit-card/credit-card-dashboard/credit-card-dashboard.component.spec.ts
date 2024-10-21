import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardDashboardComponent } from './credit-card-dashboard.component';

describe('CreditCardDashboardComponent', () => {
  let component: CreditCardDashboardComponent;
  let fixture: ComponentFixture<CreditCardDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
