import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root"
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

  getProductList(mobile: any, filterItem: any) {
    let endPoint = "";
    if (filterItem)
      Object.keys(filterItem).forEach((item) => {
        if (filterItem[item]) {
          endPoint = endPoint + `&${item}=${filterItem[item]}`;
        }
      });
    return this.http.get<any>(
      `${this.baseUrl}/origination-matser/fetchByMobile?mobileNumber=${mobile}${endPoint}`
    );
  }

  getOriginationMaster(id: any) {
    return this.http.get<any>(
      `${this.baseUrl}/origination-matser?originationId=${id}`
    );
  }
  applicationDetails(applicationId: any) {
    return this.http.get<any>(
      `${this.baseUrl}/origination-matser/applicationStatus?applicationId=${applicationId}`
    );
  }
  getLoanSummary(originationId: any) {
    return this.http.get(
      `${this.baseUrl}/webSummary?originationId=${originationId}`
    );
  }
  getLoanDocument(originationId: any) {
    return this.http.get(
      `${this.baseUrl}/origination-matser/fetchCheckListInfo?originationId=${originationId}`
    );
  }
}
