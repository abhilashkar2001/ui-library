import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositFaqComponent } from './deposit-faq.component';

describe('DepositFaqComponent', () => {
  let component: DepositFaqComponent;
  let fixture: ComponentFixture<DepositFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepositFaqComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepositFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
