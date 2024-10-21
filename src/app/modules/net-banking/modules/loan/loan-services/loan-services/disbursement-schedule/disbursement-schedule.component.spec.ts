import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementScheduleComponent } from './disbursement-schedule.component';

describe('DisbursementScheduleComponent', () => {
  let component: DisbursementScheduleComponent;
  let fixture: ComponentFixture<DisbursementScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisbursementScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisbursementScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
