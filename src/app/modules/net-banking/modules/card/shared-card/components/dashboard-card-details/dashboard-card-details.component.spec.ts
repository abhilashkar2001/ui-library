import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCardDetailsComponent } from './dashboard-card-details.component';

describe('DashboardCardDetailsComponent', () => {
  let component: DashboardCardDetailsComponent;
  let fixture: ComponentFixture<DashboardCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCardDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
