import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FlexBalanceModel } from "app/shared/models/flex-balance.model";
import { environment } from "environments/environment";
const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class InternetBankingService {
  constructor(private http: HttpClient) {}

  getDashboardInfo() {
    return this.http.get<any>(`assets/json/net-banking-dashboardInfo.json`);
  }

  getActivityLogData() {
    return this.http.get<any>(`assets/json/net-banking-activityLog.json`);
  }

  getSummary(
    filterBy,
    filterValue,
    page,
    size,
    sortName,
    direction,
    moduleName
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
    const filter = `${filterEndpoint}`;
    const pagination = `page=${page}&size=${size}`;

    const sortOperation = `sort=${sortName}&sortOrder=${direction}`;

    const payload = `?module=${moduleName}&${pagination}`;
    return this.http.get(
      `${MICROSERVICE_URL}/corporate-net-banking${payload}&status=CREATED&uploadType=BULK`
    );
  }

  fetchAccountDetails(mobileNo: string) {
    return this.http.get(
      `${MICROSERVICE_URL}/retail-fund-transfer/fetchDashBoardAccountDetails?mobileNo=${mobileNo}`
    );
  }

  /**
   * This method will call the service to fetch account balance from flex cube
   * @param accountNumber
   * @returns
   */
  fetchAccountBalance(accountNo: string) {
    return this.http.get<FlexBalanceModel>(
      `${MICROSERVICE_URL}/flex-service/queryBalance?originationAccNo=${accountNo}`
    );
  }
}
