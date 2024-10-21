import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInstantPayComponent } from './dashboard-instant-pay.component';

describe('DashboardInstantPayComponent', () => {
  let component: DashboardInstantPayComponent;
  let fixture: ComponentFixture<DashboardInstantPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardInstantPayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardInstantPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
