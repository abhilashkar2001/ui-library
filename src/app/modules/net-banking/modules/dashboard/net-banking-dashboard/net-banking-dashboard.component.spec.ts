import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetBankingDashboardComponent } from './net-banking-dashboard.component';

describe('NetBankingDashboardComponent', () => {
  let component: NetBankingDashboardComponent;
  let fixture: ComponentFixture<NetBankingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetBankingDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetBankingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
