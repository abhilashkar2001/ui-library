import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class SendMoneyAbroadService {
  protected basePath = environment.microServiceURL;
  constructor(private httpClient: HttpClient) {}

  sendMoneyAbroadProceed(payload) {
    return this.httpClient.post<any>(
      `${this.basePath}/sendMoneyAbroad`,
      payload
    );
  }

  payFrom(mobileNo) {
    return this.httpClient.get<any>(
      `${this.basePath}/fundTransfer/fetchCustInfo?mobileNo=${mobileNo}`
    );
  }

  fetchExchangeRate(curr, pairCurrency) {
    return this.httpClient.get(
      `${this.basePath}/exchangeRate/fetchRateData?currency=${curr}&pairCurrency=${pairCurrency}`
    );
  }
  // https://192.168.17:8765/exchangeRate/fetchRateData?currency=INR&pairCurrency=GBP
}
