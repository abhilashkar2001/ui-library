import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardControlComponent } from './credit-card-control.component';

describe('CreditCardControlComponent', () => {
  let component: CreditCardControlComponent;
  let fixture: ComponentFixture<CreditCardControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
