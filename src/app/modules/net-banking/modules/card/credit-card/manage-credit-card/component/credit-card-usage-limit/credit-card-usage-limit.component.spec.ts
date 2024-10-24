import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardUsageLimitComponent } from './credit-card-usage-limit.component';

describe('CreditCardUsageLimitComponent', () => {
  let component: CreditCardUsageLimitComponent;
  let fixture: ComponentFixture<CreditCardUsageLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardUsageLimitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardUsageLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
