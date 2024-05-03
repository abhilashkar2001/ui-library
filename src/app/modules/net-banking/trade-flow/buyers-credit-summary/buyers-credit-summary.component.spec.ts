import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyersCreditSummaryComponent } from './buyers-credit-summary.component';

describe('BuyersCreditSummaryComponent', () => {
  let component: BuyersCreditSummaryComponent;
  let fixture: ComponentFixture<BuyersCreditSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyersCreditSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyersCreditSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
