import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import {
  CardResponse,
  EmpAndFinInfoPayload,
  SaveCardDetailsPayload,
} from './cardModel';
import { IcHttpResponseModel } from '@onerumango/utils';

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
  // Save Employment and financial details
  saveEmployeementFinancialDetails(payload: EmpAndFinInfoPayload) {
    return this.http.post<any>(
      `${baseUrl}/card/employment-financial-details`,
      payload,
    );
  }

  // Save Card Details
  saveCardDetails(payload: SaveCardDetailsPayload) {
    return this.http.post<CardResponse>(
      `${baseUrl}/card/card-services`,
      payload,
    );
  }

  // get Financial EmployeeDetails
  fetchDynamicScreen(customerStageId: number, className: string) {
    return this.http.get<IcHttpResponseModel<any>>(
      `${baseUrl}/card/fetch?customerCardStgId=${customerStageId}&className=${className}`,
    );
  }
}

// 453;
