import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarySummaryComponent } from './beneficiary-summary.component';

describe('BeneficiarySummaryComponent', () => {
  let component: BeneficiarySummaryComponent;
  let fixture: ComponentFixture<BeneficiarySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiarySummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiarySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
