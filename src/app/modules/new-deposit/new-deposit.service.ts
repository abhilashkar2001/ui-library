import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NewDepositService {
  protected base_url = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  private token = new BehaviorSubject<any>(false);
  getToken() {
    return this.token.asObservable();
  }
  setToken(token: any) {
    this.token.next(token);
  }
  private isCreateFdDone$ = new BehaviorSubject<any>(false);
  getCreateFdDone() {
    return this.isCreateFdDone$.asObservable();
  }
  serCreateFdDone(value) {
    this.isCreateFdDone$.next(value);
  }

  // https://192.168.0.127:8765/auth/generateOTP?mobile=9114386257
  getOtp(mobile) {
    return this.http.get<any>(
      `${this.base_url}/auth/generateOTP?mobile=${mobile}`
    );
  }
  getInterestDetails() {
    return this.http.get<any>(`assets/json/deposit.json`);
  }
  verifyOtp(payload) {
    //https://192.168.0.127:8765/auth/verifyOTP
    return this.http.post<any>(`${this.base_url}/auth/verifyOTP`, payload);
  }
  getCountryDetails() {
    return this.http.get<any>(
      `${this.base_url}/country?oneTimeAuth=Y&recordStatus=OPEN`
    );
  }
  getCityDetails() {
    return this.http.get<any>(
      `${this.base_url}/city?authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }
  getStateDetails() {
    return this.http.get<any>(
      `${this.base_url}/state?authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }
  uploadDocument(formData) {
    return this.http.post<any>(`${this.base_url}/upload-document`, formData);
  }
  submitAllDocument(payload) {
    return this.http.post<any>(
      `${this.base_url}/documents?source=web Site`,
      payload
    );
  }
  genericValue(screenName: string, genericName: string[]) {
    return this.http.get<any>(
      `${this.base_url}/generic-value?screenName=${screenName}&genericName=${genericName}`
    );
  }
}
