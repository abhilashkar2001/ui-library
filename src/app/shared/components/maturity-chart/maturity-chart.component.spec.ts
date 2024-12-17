import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityChartComponent } from './maturity-chart.component';

describe('MaturityChartComponent', () => {
  let component: MaturityChartComponent;
  let fixture: ComponentFixture<MaturityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaturityChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaturityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
