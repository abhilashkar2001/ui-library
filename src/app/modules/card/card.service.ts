import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const baseUrl = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class CardSerivce {
  constructor(private http: HttpClient) {}

  //   Save card personal details
  saveCardPersonalDetails(payload: any) {
    return this.http.post<any>(`${baseUrl}/card/personal-details`, payload);
  }
  //  Save card payment details
  saveCardPaymentDetails(payload: any) {
    return this.http.post<any>(`${baseUrl}/card/payment-details`, payload);
  }
}
