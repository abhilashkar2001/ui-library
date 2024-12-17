import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCardListComponent } from './dashboard-card-list.component';

describe('DashboardCardListComponent', () => {
  let component: DashboardCardListComponent;
  let fixture: ComponentFixture<DashboardCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardCardListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
