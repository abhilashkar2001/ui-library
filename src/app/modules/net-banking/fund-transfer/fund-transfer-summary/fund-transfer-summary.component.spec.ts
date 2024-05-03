import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundTransferSummaryComponent } from './fund-transfer-summary.component';

describe('FundTransferSummaryComponent', () => {
  let component: FundTransferSummaryComponent;
  let fixture: ComponentFixture<FundTransferSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundTransferSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundTransferSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
