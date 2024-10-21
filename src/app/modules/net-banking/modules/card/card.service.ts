import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { appendFilterParam } from "app/shared/helpers/http.utils";
import { Payee } from "app/shared/models/card.model";
import { FlexBalanceModel } from "app/shared/models/flex-balance.model";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { environment } from "environments/environment";
import { Observable, Subject } from "rxjs";

const baseUrl = environment.microServiceURL;

@Injectable({
  providedIn: "root",
})
export class CardService {
  constructor(private http: HttpClient) {}
  fetchAllRecentTransaction(customerId, cardNo, payload?) {
    let params = appendFilterParam(payload);
    return this.http.get<any>(
      `${baseUrl}/card/fetchRecentTransaction?corporateCustomerId=${customerId}&cardNo=${cardNo}${
        params ? `&${params}` : ``
      }`
    );
  }
  fetchScreenWiseRecentTrans(transferType, customerId, payload?) {
    let params = appendFilterParam(payload);
    return this.http.get<any>(
      `${baseUrl}/retail-fund-transfer/fetchRecentTransaction?transferType=${transferType}&fetchScreenWiseRecentTrans=${customerId}${
        params ? `&${params}` : ``
      }`
    );
  }
  fetchCardSummary(customerId, cardType) {
    return this.http.get<any>(
      `${baseUrl}/card/fetch-card-summary?corporateId=${customerId}&cardType=${cardType}`
    );
  }
  saveCreditPaymentDetails(payload) {
    return this.http.post(`${baseUrl}/card/pay`, payload);
  }
  generateAccountQr(accnum) {
    return this.http.post<any>(
      `${baseUrl}/task-summary/get-qr-code?originationAccNo=${accnum}`,
      "",
      { responseType: "Blob" as "json" }
    );
  }
  getBalance(accNo) {
    return this.http.get(
      `${baseUrl}/flex-service/queryBalance?originationAccNo=${accNo}
`
    );
  }
  instantPay(payload) {
    return this.http.post<any>(
      `${baseUrl}/retail-fund-transfer/transfer-money`,
      payload
    );
  }
  /**
   * This method will call the service to fetch account balance from flex cube
   * @param accountNumber
   * @returns
   */
  fetchAccountBalance(accountNo: string) {
    return this.http.get<FlexBalanceModel>(
      `${baseUrl}/flex-service/queryBalance?originationAccNo=${accountNo}`
    );
  }
  fetchPayeeList(payload) {
    return this.http.post<IcHttpResponseModel<Payee[]>>(
      `${baseUrl}/retail-beneficiary/fetchBenificiary`,
      payload
    );
  }
}
