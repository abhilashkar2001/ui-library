import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanServiceDashboardComponent } from './loan-service-dashboard.component';

describe('LoanServiceDashboardComponent', () => {
  let component: LoanServiceDashboardComponent;
  let fixture: ComponentFixture<LoanServiceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanServiceDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanServiceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
