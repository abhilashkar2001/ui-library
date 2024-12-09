import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: "root"
})
export class SendMoneyService {
  constructor(private http: HttpClient) {}

  fetchPayeeList() {
    return this.http.get<IcHttpResponseModel<any[]>>(
      `${MICROSERVICE_URL}/corp_benieficiary`
    );
  }

  instantPay(payload: any) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/retail-fund-transfer/transfer-money`,
      payload
    );
  }
}
