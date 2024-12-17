import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardServiceComponent } from './credit-card-service.component';

describe('CreditCardServiceComponent', () => {
  let component: CreditCardServiceComponent;
  let fixture: ComponentFixture<CreditCardServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditCardServiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditCardServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
