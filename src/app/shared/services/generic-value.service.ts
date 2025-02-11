import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, of, map } from 'rxjs';
import { GenericValue } from '../data/generic-value';
import { GenericValueInfoModel } from '../models/generic-value.model';
import { appendFilterParam, IcHttpResponseModel } from '@onerumango/utils';

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class GenericValueService extends GenericValue {
  genericValue: IcHttpResponseModel<GenericValueInfoModel> | undefined;

  constructor(private http: HttpClient) {
    super();
  }

  loadGenericValue(
    genericName: string[],
    screenCode?: number,
  ): Observable<IcHttpResponseModel<GenericValueInfoModel>> {
    if (this.genericValue && Object.keys(this.genericValue?.data).length > 0) {
      genericName = genericName?.filter(
        (name: any) =>
          !Object.keys(this.genericValue?.data ?? {})?.includes(name),
      );
      if (genericName?.length < 1) {
        return of(this.genericValue);
      } else {
        return this.fetchGenericValue({ genericName, screenCode });
      }
    } else {
      return this.fetchGenericValue({ genericName, screenCode });
    }
  }

  fetchGenericValue(
    paramsObj: any,
  ): Observable<IcHttpResponseModel<GenericValueInfoModel>> {
    const params = appendFilterParam(paramsObj);

    return this.http
      .get<
        IcHttpResponseModel<GenericValueInfoModel>
      >(`${MICROSERVICE_URL}/generic-value`, { params })
      .pipe(map(this.processData, this));
  }

  private processData(
    data: IcHttpResponseModel<GenericValueInfoModel>,
  ): IcHttpResponseModel<GenericValueInfoModel> {
    if (data) {
      this.genericValue = {
        ...data,
        ...{ data: { ...this.genericValue?.data, ...data?.data } },
      };
    }
    return this.genericValue as IcHttpResponseModel<GenericValueInfoModel>;
  }
}
