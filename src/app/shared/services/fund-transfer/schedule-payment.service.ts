import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class SchedulePaymentService {
  constructor(private http: HttpClient) { }

  fetchViewSchedulePayment(debitAccount?: string) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/fundTransfer/fetchScheduledPayment?debitAccount=${debitAccount}`
    );
  }

  saveScheduleData(payload) {
    return this.http.post(
      `${MICROSERVICE_URL}/fundTransfer/save-schedule-payment`,
      payload
    );
  }

  downloadData() {
    const httpOptions = {
      responseType: "blob" as "json",
    };
    return this.http.get<any>(
      `${MICROSERVICE_URL}/fundTransfer/downloadScheduledPaymentInfo`,
      httpOptions
    );
  }

  fetchGeneric() {
    return this.http.get(
      `${MICROSERVICE_URL}/generic-value?screenName=Common&genericName=FREQUENCY&language=English`
    );
  }

  getPayDetails(mobileNum) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/fundTransfer/fetchCustInfo?mobileNo=${mobileNum}`
    );
  }
  getTransferDetails(payload,customerId) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/retail-beneficiary/fetchBenificiary?customerId=${customerId}`,
      payload
    );
  }
  save(payload) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/fundTransfer/save-schedule-payment`,
      payload
    );
  }
  getAccounts(cusNo) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/customer/accountInfo?customerNo=${cusNo}`
    );
  }
  fetchInfoByoriginationAccNo(accNo) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/account/info?originationAccNo=${accNo}`
    );
  }
}
