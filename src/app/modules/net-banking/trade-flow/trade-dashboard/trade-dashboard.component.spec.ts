import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDashboardComponent } from './trade-dashboard.component';

describe('TradeDashboardComponent', () => {
  let component: TradeDashboardComponent;
  let fixture: ComponentFixture<TradeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
