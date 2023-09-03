import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanUserSelectKycComponent } from './loan-user-select-kyc.component';

describe('LoanUserSelectKycComponent', () => {
  let component: LoanUserSelectKycComponent;
  let fixture: ComponentFixture<LoanUserSelectKycComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanUserSelectKycComponent]
    });
    fixture = TestBed.createComponent(LoanUserSelectKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
