import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  getOtp(data: { mobile: number }) {
    return this.http.post<any>(`${this.baseUrl}/auth/generateOtp`, data);
  }

  verifyOtp(otpObject: any) {
    return this.http.post(`${this.baseUrl}/auth/verifyOtp`, otpObject);
  }

  getProductList(mobile: any, filterItem: any) {
    let endPoint = '';
    if (filterItem)
      Object.keys(filterItem).forEach((item) => {
        if (filterItem[item]) {
          endPoint = endPoint + `&${item}=${filterItem[item]}`;
        }
      });
    return this.http.get<any>(
      `${this.baseUrl}/origination-matser/fetchByMobile?mobileNumber=${mobile}${endPoint}`,
    );
  }

  applicationDetails(applicationId: any) {
    return this.http.get<any>(
      `${this.baseUrl}/origination-matser/applicationStatus?applicationId=${applicationId}`,
    );
  }
}
