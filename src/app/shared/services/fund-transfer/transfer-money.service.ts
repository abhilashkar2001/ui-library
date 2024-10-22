import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: "root",
})
export class TransferMoneyService {
  constructor(private httpClient: HttpClient) {}

  saveTransferMoney(payload) {
    return this.httpClient.post(
      `${MICROSERVICE_URL}/retail-fund-transfer/transfer-money`,
      payload
    );
  }
}
