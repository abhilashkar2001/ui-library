import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { pluckOnlyDate } from 'app/shared/helpers/utils';
import { CalendarHeaderComponent } from '../calendar-header/calendar-header.component';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
  },
};
@Component({
  selector: 'app-created-duration-model',
  templateUrl: './created-duration-model.component.html',
  styleUrls: ['./created-duration-model.component.scss'],
  providers: [DatePipe],
})
export class CreatedDurationModelComponent implements OnInit {
  readonly calendarHeaderComponent = CalendarHeaderComponent;
  fromDate: string | any;
  maxDate: Date | any;
  toDate: string | any;
  value: string[] | any;
  selectedDate: any;
  todayDate: Date = new Date();
  tomorrowDate: Date = new Date();
  maxFromDate: Date | any = null;
  fromMask: any;
  toMask: any;
  constructor(
    private dialogRef: MatDialogRef<CreatedDurationModelComponent>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private sessionStorageService: SessionStorageService,
  ) {
    this.matIconRegistry.addSvgIcon(
      `calendar-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/calendar.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.tomorrowDate.setDate(this.todayDate.getDate() + 1);
    this.fromDate = this.sessionStorageService.getFromDate();
    this.toDate = this.sessionStorageService.getToDate();
  }

  close() {
    this.value = [
      this.convertDate(this.fromDate),
      this.convertDate(this.toDate),
    ];
    this.dialogRef.close(this.value);
    this.sessionStorageService.setFromDate(this.value[0]);
    this.sessionStorageService.setToDate(this.value[1]);
  }

  getToDateValidity() {
    return new Date(this.fromDate);
  }

  onToDateChange(selectedDate: Date): void {
    this.maxFromDate = selectedDate ? selectedDate : null;
    this.cdr.detectChanges();
  }

  /**
   * @method dateDispatchEventFrom():void
   * @param key
   * @param event
   */

  dateDispatchEventFrom(key: string, event: MatDatepickerInputEvent<Date>) {
    const convertDate = pluckOnlyDate(event?.value);
    console.log(key);

    key = convertDate;
  }

  /**
   * @method dateDispatchEventTo():void
   * @param key
   * @param event
   */

  dateDispatchEventTo(key: string | any, event: MatDatepickerInputEvent<Date>) {
    const convertDate = pluckOnlyDate(event?.value);
    key = convertDate;
    console.log(key);

    // convertDate = key;
  }
  convertDate(value: any) {
    const date = moment(value).format('YYYY-MM-DD');
    if (date) return date;
    return;
  }

  goBack() {
    this.dialogRef.close();
  }
}
