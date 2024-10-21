import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHeaderComponent } from './calendar-header.component';

describe('CalendarHeaderComponent', () => {
  let component: CalendarHeaderComponent<any>;
  let fixture: ComponentFixture<CalendarHeaderComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarHeaderComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CalendarHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
