import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class FundTransferService {
  constructor(private http: HttpClient) {}

  fetchBenificiary() {
    return this.http.get<any>(`${MICROSERVICE_URL}/corp_benieficiary`);
  }

  fetchGeneric(screen, generic) {
    return this.http.get(
      `${MICROSERVICE_URL}/generic-value?screenName=${screen}&genericName=${generic}&language=English`
    );
  }

  saveFundTransferData(payload) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/corporate-net-banking/save-multi-or-single-transfer`,
      payload
    );
  }
}
