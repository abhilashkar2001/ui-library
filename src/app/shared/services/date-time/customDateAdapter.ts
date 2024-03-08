// customDateAdapter.ts
import { Injectable } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateTimeService } from "./date-time.service";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class CustomDateAdapter extends MomentDateAdapter {
  constructor(private _dateTimeService: DateTimeService) {
    super(_dateTimeService.locale);
  }

  public format(date: moment.Moment): string {
    const locale = this._dateTimeService.locale;
    const format = this._dateTimeService.format;

    const result = date.locale(locale).format(format);

    return result;
  }
}
