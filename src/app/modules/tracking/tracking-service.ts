import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class TrackingService {
  baseUrl = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  getOtp(phoneNumber: number) {
    return this.http.get<any>(
      `${this.baseUrl}/auth/generateOTP?mobile=${phoneNumber}`
    );
  }
  verifyOtp(otpObject: any) {
    return this.http.post(`${this.baseUrl}/auth/verifyOTP`, otpObject);
  }

  getProductList(mobile) {
    return this.http.get<any>(
      `${this.baseUrl}/origination-matser/fetchByMobile?mobileNumber=${mobile}`
    );
  }

  getOriginationMaster(id) {
    return this.http.get<any>(
      `${this.baseUrl}/origination-matser?originationId=${id}`
    );
  }
  getLoanSummary(originationId: any) {
    return this.http.get(
      `${this.baseUrl}/webSummary?originationId=${originationId}`
    );
  }
}
