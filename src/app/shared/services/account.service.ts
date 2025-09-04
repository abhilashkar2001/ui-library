import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

const baseUrl = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient) {}

  getAccountDetails(originationId: number) {
    return this.http.get<any>(
      `${baseUrl}/account?originationId=${originationId}`,
      {},
    );
  }

  //   Save Account personal details
  saveAccountPersonalDetails(payload: any) {
    return this.http.post<any>(`${baseUrl}/account`, payload);
  }

  saveAccountDetails(payload: any) {
    console.log('PAYLOAD: ', payload);
    return this.http.post<any>(`${baseUrl}/account`, payload);
  }

  fetchBranch() {
    return this.http.get<any>(
      `${baseUrl}/branch?oneTimeAuth=Y&recordStatus=OPEN`,
    );
  }
  fetchCurrency() {
    return this.http.get<any>(
      `${baseUrl}/icCurrency?oneTimeAuth=Y&recordStatus=OPEN`,
    );
  }

  fetchCustomerCategory() {
    return this.http.get<any>(
      `${baseUrl}/customerCategory?oneTimeAuth=Y&recordStatus=OPEN`,
    );
  }

  getstaticdata(screenName: string, staticdataneeded: any) {
    return this.http.get<any>(
      `${baseUrl}/generic-value?screenName=${screenName}&genericName=${staticdataneeded}&authStatus=AUTHORIZED&recordStatus=OPEN`,
    );
  }

  fetchBoundariesDetails(productId: number) {
    return this.http.get<any>(`${baseUrl}/boundaries?productId=${productId}`);
  }
}
