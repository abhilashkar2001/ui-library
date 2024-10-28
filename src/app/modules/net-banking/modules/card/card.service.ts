import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { appendFilterParam } from "app/shared/helpers/http.utils";
import { Payee } from "app/shared/models/card.model";
import {
  cardTransactionDetails,
  EmiDetails,
} from "app/shared/models/emi-converter.model";
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

  fetchCardRecentTransaction(corporateId, cardNumber, cardType) {
    return this.http.get<any>(
      `${baseUrl}/card/fetchTransactions?corporateId=${corporateId}&cardNo=${cardNumber}&cardType=${cardType}`
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
    return this.http.post(`${baseUrl}/card/pay-corp`, payload);
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
  saveAutoPayCreditPaymentDetails(payload) {
    return this.http.post(`${baseUrl}/card/auto-pay`, payload);
  }
  saveBlockPayCreditPaymentDetails(payload) {
    return this.http.post(`${baseUrl}/card/block-card`, payload);
  }

  saveBillingCycleCreditPaymentDetails(payload) {
    return this.http.put(`${baseUrl}/card/updateBillingCycle`, payload);
  }
  eStatementSubscribe(payload) {
    return this.http.post<any>(`${baseUrl}/estatement/save`, payload);
  }
  public fetchbycustomerId(customerId) {
    return this.http.get<any>(
      `${baseUrl}/customer-api?customerId=${customerId}`
    );
  }
  public fetchAlertByCardNo(cardNo) {
    return this.http.get<any>(
      `${baseUrl}/card/alert-subscription?cardNo=${cardNo}`
    );
  }

  saveAddOnCreditPaymentDetails(payload) {
    return this.http.put(`${baseUrl}/card/addon-cards`, payload);
  }
  fetchCardTransactionDetails(cardNo, corporateId) {
    return this.http.get<IcHttpResponseModel<cardTransactionDetails>>(
      `${baseUrl}/card/fetchTransactions?cardNo=${cardNo}&corporateId=${corporateId}`
    );
  }
  calculateEmi(obj) {
    return this.http.post<IcHttpResponseModel<any>>(
      `${baseUrl}/api/loan-repayment/emi-calculation`,
      obj
    );
  }
  convertToEmi(payload) {
    return this.http.post<IcHttpResponseModel<any>>(
      `${baseUrl}/card/convert-to-emi`,
      payload
    );
  }
  fetchListOfCards(customerId: number) {
    return this.http.get<IcHttpResponseModel<string[]>>(
      `${baseUrl}/card/fetch-cardNo?customerId=${customerId}`
    );
  }
  fetchEmiDetails(cardNo, customerId) {
    return this.http.get<IcHttpResponseModel<EmiDetails[]>>(
      `${baseUrl}/card/fetch-emi?cardNo=${cardNo}&customerId=${customerId}`
    );
  }
  downloadCreditInfoAsPdf(accountNo: any, month: any, year: any) {
    return this.http.get<any>(
      `${baseUrl}/card/fetchCorpCardPaymentDetailsPdf?cardNo=${accountNo}&month=${month}&year=${year}`
    );
  }
  setPin(cardNumber, cvv, pin) {
    return this.http.put<IcHttpResponseModel<any>>(
      `${baseUrl}/card/set-pin?cardNumber=${cardNumber}&cvv=${cvv}&pin=${pin}`,
      ""
    );
  }
  savePrepaidReload(payload) {
    return this.http.post<IcHttpResponseModel<any>>(
      `${baseUrl}/card/reload-prepaid`,
      payload
    );
  }
  savePrepaidRefund(payload) {
    return this.http.post<IcHttpResponseModel<any>>(
      `${baseUrl}/card/refund-prepaid`,
      payload
    );
  }
  fetchRefund(cardNo: number) {
    return this.http.get<IcHttpResponseModel<any>>(
      `${baseUrl}/card/fetch-refund?cardNumber=${cardNo}`
    );
  }
  fetchRecentTransaction(cardNo: number) {
    return this.http.get<IcHttpResponseModel<any>>(
      `${baseUrl}/card/debit-transaction?cardNumber=${cardNo}&cardType=Prepaid Card`
    );
  }

  fdRdCalculatorDetails(bookType, amount, tenureYear, tenureMonth, tenureDay) {
    return this.http.get<any>(
      `${baseUrl}/fdRd/fd-rd-calculator?bookType=${bookType}&amount=${amount}&tenureYears=${tenureYear}&tenureMonths=${tenureMonth}&tenureDays=${tenureDay}`
    );
  }
  saveUpgradeCreditPaymentDetails(payload) {
    return this.http.post(`${baseUrl}/card/upgrade-card`, payload);
  }
  fetchAllRecentTransaction(customerId, payload?) {
    let params = appendFilterParam(payload);
    return this.http.get<any>(
      `${baseUrl}/retail-fund-transfer/fetchRecentTransaction?customerId=${customerId}${params ? `&${params}` : ``}`
    );
  }

  fetchCreditCardRecentTransaction(customerId, cardNumber, cardType) {
    return this.http.get<any>(
      `${baseUrl}/card/fetchTransactions?customerId=${customerId}&cardNo=${cardNumber}&cardType=${cardType}`
    );
  }

  fetchDebitCardRecentTransaction(cardNumber, cardType) {
    return this.http.get<any>(
      `${baseUrl}/card/debit-transaction?cardNumber=${cardNumber}&cardType=${cardType}`
    );
  }
}
