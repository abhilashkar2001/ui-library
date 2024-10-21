import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class SelfTransferService {
  protected basePath = environment.microServiceURL;
  constructor(private httpClient: HttpClient) { }

  saveSelfTranfer(payload) {
    return this.httpClient.post<any>(
      `${this.basePath}/retail-fund-transfer/transfer-money`,
      payload
    );
  }

  getAccountDetails(accountNumber: number) {
    return this.httpClient.get<any>(
      `${this.basePath}/fundTransfer/fetchCustInfo?accountNumber=${accountNumber}`
    );
  }
}
