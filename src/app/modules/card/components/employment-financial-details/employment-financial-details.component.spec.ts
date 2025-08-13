import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentFinancialDetailsComponent } from './employment-financial-details.component';

describe('EmploymentFinancialDetailsComponent', () => {
  let component: EmploymentFinancialDetailsComponent;
  let fixture: ComponentFixture<EmploymentFinancialDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmploymentFinancialDetailsComponent],
    });
    fixture = TestBed.createComponent(EmploymentFinancialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
