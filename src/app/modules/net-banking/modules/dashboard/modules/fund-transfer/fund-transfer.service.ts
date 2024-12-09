import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: "root"
})
export class FundTransferService {
  constructor(private http: HttpClient) {}

  getSummary(
    filterBy: any,
    page: any,
    size: any,
    moduleName: any,
    uploadType: any
  ) {
    var filterEndpoint = "";
    if (filterBy) {
      const keys = Object.keys(filterBy);
      keys.forEach((key) => {
        if (filterBy[key])
          key == "newFilter"
            ? (filterEndpoint = filterEndpoint + `branchCode=${filterBy[key]}&`)
            : (filterEndpoint = filterEndpoint + `${key}=${filterBy[key]}&`);
      });
    }
    const pagination = `page=${page}&size=${size}`;

    const payload = `?module=${moduleName}&${pagination}`;
    return this.http.get(
      `${MICROSERVICE_URL}/corporate-net-banking${payload}&uploadType=${uploadType}`
    );
  }

  fetchBenificiary(corporateId: any) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/corp_benieficiary?corporateId=${corporateId}`
    );
  }

  fetchGeneric(screen: any, generic: any) {
    return this.http.get(
      `${MICROSERVICE_URL}/generic-value?screenName=${screen}&genericName=${generic}&language=English`
    );
  }

  saveFundTransferData(payload: any) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/corporate-net-banking/save-multi-or-single-transfer`,
      payload
    );
  }

  saveCreditCard(payload: any) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/corporate-net-banking/creditCardPayment`,
      payload
    );
  }
}
