// customDateAdapter.ts
import { Injectable } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateTimeService } from "./date-time.service";
import * as moment from "moment";

const defaultLocale = "en-US";
const defaultDateFormatter = "DD-MM-YYYY";
@Injectable({
  providedIn: "root"
})
export class CustomDateAdapter extends MomentDateAdapter {
  constructor(private _dateTimeService: DateTimeService) {
    super(_dateTimeService.locale);
  }

  public override format(date: moment.Moment): string {
    const locale = this._dateTimeService.locale ?? defaultLocale;
    const format = this._dateTimeService.format ?? defaultDateFormatter;
    const result = date.locale(locale).format(format);

    return result;
  }
}
