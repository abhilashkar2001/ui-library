import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class FundTransferService {
  constructor(private http: HttpClient) {}

  saveFundTransferData(payload) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/corporate-net-banking/save-multi-or-single-transfer`,
      payload
    );
  }
}
