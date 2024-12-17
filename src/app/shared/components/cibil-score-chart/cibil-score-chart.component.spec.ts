import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibilScoreChartComponent } from './cibil-score-chart.component';

describe('CibilScoreChartComponent', () => {
  let component: CibilScoreChartComponent;
  let fixture: ComponentFixture<CibilScoreChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CibilScoreChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CibilScoreChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
