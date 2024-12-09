import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable, of } from "rxjs";
import { GenericValue } from "../data/generic-value";
import { map } from "rxjs/operators";
import { GenericValueInfoModel } from "../models/generic-value.model";
import { IcHttpResponseModel } from "../models/ic-http-response.model";

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: "root"
})
export class GenericValueService extends GenericValue {
  genericValue: any;

  constructor(private http: HttpClient) {
    super();
  }

  loadGenericValue(
    screenName: any,
    genericName: string[]
  ): Observable<IcHttpResponseModel<GenericValueInfoModel>> {
    console.log(this.genericValue);
    console.log(genericName);
    if (this.genericValue && Object.keys(this.genericValue?.data).length > 0) {
      genericName = genericName?.filter(
        (name) => !Object.keys(this.genericValue?.data)?.includes(name)
      );
      if (genericName?.length < 1) {
        return of(this.genericValue);
      } else {
        return this.fetchGenericValue(screenName, genericName);
      }
    } else {
      return this.fetchGenericValue(screenName, genericName);
    }
  }

  fetchGenericValue(screenName: any, genericName: any) {
    return this.http
      .get(
        `${MICROSERVICE_URL}/generic-value?screenName=${screenName}&genericName=${genericName}`
      )
      .pipe(map(this.processData, this));
  }

  private processData(data: any) {
    console.log(data);
    if (data) {
      this.genericValue = {
        ...data,
        ...{ data: { ...this.genericValue?.data, ...data?.data } }
      };
    }
    return this.genericValue;
  }
}
