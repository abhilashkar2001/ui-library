import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

const baseUrl = environment.basePath;
@Injectable({
  providedIn: "root",
})
export class OpenAccountService {
  constructor(private http: HttpClient) {}

  getOtp(phoneNumber: number): Observable<any> | any {
    return this.http.get(`${baseUrl}/auth/generateOTP?mobile=${phoneNumber}`);
  }

  verifyOtp(otpObject: any) {
    return this.http.post(`${baseUrl}/auth/verifyOTP`, otpObject);
  }

  nationalVerifyOtp(otpObject: any) {
    return this.http.post(`${baseUrl}/auth/verifyOTP`, otpObject);
  }

  savePersonalDetails(personalDetails: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/customer/customer-info`, personalDetails);
  }

  uploadDocument(documentObjects: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/upload-document`, documentObjects);
  }

  uploadMultipleDocument(documentObjects: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/documents`, documentObjects);
  }

  verifyKYC() {}

  getResidentType() {
    return this.http.get(`${baseUrl}/details?businessSuite`);
  }

  getGender() {
    return this.http.get(`${baseUrl}/details?businessSuite`);
  }

  getCity(stateId: number) {
    return this.http.get(`${baseUrl}/city?stateId=${stateId}`);
  }

  getState(countryCode: any) {
    return this.http.get(`${baseUrl}/state?countryCode=${countryCode}`);
  }

  getCountryList() {
    return this.http.get(`${baseUrl}/country`);
  }

  getSubAccountsOfAccounts(subAccount: string) {
    return this.http.get(
      `${baseUrl}/details/fetchSubClass?basisClass=${subAccount}`
    );
  }
}
