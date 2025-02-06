import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: 'root',
})
export class SchedulePaymentService {
  constructor(private http: HttpClient) {}

  save(payload: any) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/corporate-net-banking/save-corp-schedule-payment`,
      payload,
    );
  }

  fetchInfoByoriginationAccNo(accNo: string | number) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/account/info?originationAccNo=${accNo}`,
    );
  }
}
