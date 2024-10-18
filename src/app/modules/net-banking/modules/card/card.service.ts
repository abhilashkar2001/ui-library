import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { appendFilterParam } from "app/shared/helpers/http.utils";
import { environment } from "environments/environment";
import { Observable, Subject } from "rxjs";

const baseUrl = environment.microServiceURL;

@Injectable({
  providedIn: "root",
})
export class CardService {
  constructor(private http: HttpClient) {}
  fetchAllRecentTransaction(customerId, payload?) {
    let params = appendFilterParam(payload);
    return this.http.get<any>(
      `${baseUrl}/retail-fund-transfer/fetchRecentTransaction?customerId=${customerId}${
        params ? `&${params}` : ``
      }`
    );
  }
  fetchScreenWiseRecentTrans(transferType, customerId, payload?) {
    let params = appendFilterParam(payload);
    return this.http.get<any>(
      `${baseUrl}/retail-fund-transfer/fetchRecentTransaction?transferType=${transferType}&customerId=${customerId}${
        params ? `&${params}` : ``
      }`
    );
  }
  fetchCardSummary(customerId, cardType) {
    return this.http.get<any>(
      `${baseUrl}/card/fetch-card-summary?customerId=${customerId}&cardType=${cardType}`
    );
  }
}
