// date-time.service
import { Injectable } from '@angular/core';
import { DEFAULT_LOCALE } from 'app/shared/helpers/utils';
import { SearchService } from 'app/shared/search/search.service';
import { CustomizerService } from '../customizer.service';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  _format: string | any;
  _locale: string | any;
  currentLocal: any;

  public constructor(
    private tokenService: CustomizerService,
    private shareService: SearchService,
  ) {
    this.currentLocal = this.tokenService.getLogedCountry() ?? DEFAULT_LOCALE;
    this.shareService.isRefresh.subscribe((opt) => {
      this.init(opt);
    });
  }

  init(opt: any) {
    this._format = opt?.dateFormat ?? this.currentLocal?.dateFormat;
    this._locale = opt?.locale ?? this.currentLocal?.locale;
  }

  public get format(): string {
    return this._format;
  }

  public set format(value: string) {
    this._format = value;
  }

  public get locale(): string {
    return this._locale;
  }

  public set locale(value: string) {
    this._locale = value;
  }
}
