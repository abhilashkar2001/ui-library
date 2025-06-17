import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopupComponent } from 'app/shared/components/success-popup/success-popup.component';
import * as moment from 'moment';

export const MATERIAL_DATEPICKER_FORMATS = {
  parse: {
    dateInput: 'DD/MMM/YYYY',
  },
  display: {
    dateInput: 'DD/MMM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MMM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

class CustomDateAdapter extends MomentDateAdapter {
  override getDayOfWeekNames(_style: 'long' | 'short' | 'narrow') {
    return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  }
}

@Component({
  selector: 'app-schedule-kyc-video',
  templateUrl: './schedule-kyc-video.component.html',
  styleUrls: ['./schedule-kyc-video.component.scss'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MATERIAL_DATEPICKER_FORMATS },
  ],
})
export class ScheduleKycVideoComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  selectedDate: any;
  formatedSelectedDate: any;
  timeSlots: any[] = [];
  selectedTimeSlot = '';
  kycInfo = {
    name: 'Saanvi',
    mobile: '82919918388',
    dateOfSchedule: '12th Jun',
  };
  description = 'Web Conferencing details provided upon confirmation';
  timeZone = 'India Standard Time (5:41pm)';

  constructor(private dialog: MatDialog) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 6);
  }

  ngOnInit(): void {
    const startTime = '09:00';
    const endTime = '20:00';
    const interval = 60;
    this.timeSlots = this.generateTimeSlots(startTime, endTime, interval);
    console.log(this.timeSlots);
  }

  dateClass: MatCalendarCellClassFunction<Date> = (date, view) => {
    const cellDate = new Date(date);
    if (view === 'month') {
      const highlightDate = cellDate.getDay() == 0 || cellDate.getDay() == 6;
      return highlightDate ? 'custom-date-class' : '';
    }
    return '';
  };

  onSelect(event: any) {
    this.selectedDate = this.convertDate(event);
    this.formatedSelectedDate = new Date(this.selectedDate).toLocaleDateString(
      'en-US',
      { weekday: 'long', month: 'long', day: '2-digit' },
    );
    this.selectedTimeSlot = '';
  }

  convertDate(value: any) {
    const date = moment(value).format('YYYY-MM-DD');
    if (date) return date;
    return;
  }

  generateTimeSlots(startTime: any, endTime: any, interval: any) {
    const timeSlots = [];
    const currentTime = new Date('01/01/2024 ' + startTime);
    const endTimeObj = new Date('01/01/2024 ' + endTime);

    while (currentTime < endTimeObj) {
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;

      const formattedTime = `${formattedHours}:${
        minutes < 10 ? '0' : ''
      }${minutes} ${period}`;

      timeSlots.push({
        time: formattedTime,
        available: true, // You can set this based on your availability logic
        selected: false,
        booked: false,
      });

      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }

    return timeSlots;
  }

  onTimeSelected(timeSlot: any) {
    this.selectedTimeSlot = timeSlot.time;
    console.log(timeSlot);
  }

  scheduleAppointment() {
    this.dialog.open(SuccessPopupComponent, {
      data: {
        status: false,
        isStageAvilable: true,
        msg: 'Your appointment scheduled successfully!',
        type: 'scheduleCall',
        generatedLink: 'dk',
        appontment: {
          selectedDate: this.selectedDate,
          selectedTime: this.selectedTimeSlot,
        },
      },
      width: '50%',
      disableClose: true,
      panelClass: 'popup-class',
      backdropClass: 'bdrop',
    });
  }
}
