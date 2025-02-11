import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: 'root',
})
export class OtpService {
  constructor(private http: HttpClient) {}

  generateOTP(payload: any) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/auth/generateOtp`,
      payload?.mobile
        ? `{"mobile":${payload?.mobile}}`
        : `email:${payload?.email}`,
    );
  }

  verifyOTP(payload: any) {
    return this.http.post<any>(`${MICROSERVICE_URL}/auth/verifyOtp`, payload);
  }
}
