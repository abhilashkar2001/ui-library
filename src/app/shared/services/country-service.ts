import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class CountryService {
  constructor(private http: HttpClient) {}

  public getCountries(): Observable<any> {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/country?authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }
}
