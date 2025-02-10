import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDatePickerComponent } from './input-date-picker.component';

describe('InputDatePickerComponent', () => {
  let component: InputDatePickerComponent;
  let fixture: ComponentFixture<InputDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputDatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
