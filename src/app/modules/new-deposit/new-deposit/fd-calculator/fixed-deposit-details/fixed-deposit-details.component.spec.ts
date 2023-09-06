import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedDepositDetailsComponent } from './fixed-deposit-details.component';

describe('FixedDepositDetailsComponent', () => {
  let component: FixedDepositDetailsComponent;
  let fixture: ComponentFixture<FixedDepositDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedDepositDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedDepositDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
