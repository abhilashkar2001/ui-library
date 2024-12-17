import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeFlowComponent } from './trade-flow.component';

describe('TradeFlowComponent', () => {
  let component: TradeFlowComponent;
  let fixture: ComponentFixture<TradeFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TradeFlowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TradeFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
