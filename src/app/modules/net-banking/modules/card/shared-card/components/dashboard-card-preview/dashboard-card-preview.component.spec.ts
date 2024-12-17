import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCardPreviewComponent } from './dashboard-card-preview.component';

describe('DashboardCardPreviewComponent', () => {
  let component: DashboardCardPreviewComponent;
  let fixture: ComponentFixture<DashboardCardPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardCardPreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
