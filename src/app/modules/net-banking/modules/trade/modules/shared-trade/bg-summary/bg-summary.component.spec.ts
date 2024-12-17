import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgSummaryComponent } from './bg-summary.component';

describe('BgSummaryComponent', () => {
  let component: BgSummaryComponent;
  let fixture: ComponentFixture<BgSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BgSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BgSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
