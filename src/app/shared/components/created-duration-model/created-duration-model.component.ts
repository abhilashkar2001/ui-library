import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { pluckOnlyDate } from "app/shared/helpers/utils";
import { CalendarHeaderComponent } from "../calendar-header/calendar-header.component";
import { MatDialogRef } from "@angular/material/dialog";

export const MY_FORMATS = {
  parse: {
    dateInput: "LL"
  },
  display: {
    dateInput: "DD-MM-YYYY"
  }
};
@Component({
  selector: "app-created-duration-model",
  templateUrl: "./created-duration-model.component.html",
  styleUrls: ["./created-duration-model.component.scss"],
  providers: [DatePipe]
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
    private cdr: ChangeDetectorRef
  ) {
    this.matIconRegistry.addSvgIcon(
      `calendar-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/calendar.svg"
      )
    );
  }

  ngOnInit(): void {
    this.tomorrowDate.setDate(this.todayDate.getDate() + 1);
    this.fromDate = sessionStorage.getItem("fromDate");
    this.toDate = sessionStorage.getItem("toDate");
  }

  close() {
    this.value = [
      this.convertDate(this.fromDate),
      this.convertDate(this.toDate)
    ];
    this.dialogRef.close(this.value);
    sessionStorage.setItem("fromDate", this.value[0]);
    sessionStorage.setItem("toDate", this.value[1]);
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
    let convertDate = pluckOnlyDate(event?.value);
    console.log(key);

    key = convertDate;
  }

  /**
   * @method dateDispatchEventTo():void
   * @param key
   * @param event
   */

  dateDispatchEventTo(key: string | any, event: MatDatepickerInputEvent<Date>) {
    let convertDate = pluckOnlyDate(event?.value);
    key = convertDate;
    console.log(key);

    // convertDate = key;
  }
  convertDate(value: any) {
    let date = moment(value).format("YYYY-MM-DD");
    if (date) return date;
    return;
  }

  goBack() {
    this.dialogRef.close();
  }
}
