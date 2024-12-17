import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleKycVideoComponent } from './schedule-kyc-video.component';

describe('ScheduleKycVideoComponent', () => {
  let component: ScheduleKycVideoComponent;
  let fixture: ComponentFixture<ScheduleKycVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleKycVideoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleKycVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
