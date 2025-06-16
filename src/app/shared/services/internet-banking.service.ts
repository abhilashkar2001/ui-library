import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FlexBalanceModel } from 'app/shared/models/flex-balance.model';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { environment } from 'environments/environment';

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class InternetBankingService {
  constructor(private http: HttpClient) {}

  getDashboardInfo(id: any) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/retail-fund-transfer/fetchCorpDashboardAccounts?corporateId=${id}`,
    );
  }

  getActivityLogData() {
    return this.http.get<any>(`assets/json/net-banking-activityLog.json`);
  }

  getSummary(
    filterBy: any,
    page: any,
    size: any,
    moduleName: any,
    status?: any,
    corporateId?: any,
  ) {
    let filterEndpoint = '';
    if (filterBy) {
      const keys = Object.keys(filterBy);
      keys.forEach((key) => {
        if (filterBy[key])
          key == 'newFilter'
            ? (filterEndpoint = filterEndpoint + `branchCode=${filterBy[key]}&`)
            : (filterEndpoint = filterEndpoint + `${key}=${filterBy[key]}&`);
      });
    }
    const pagination = `page=${page}&size=${size}`;

    const payload = `?module=${moduleName}&${pagination}`;
    return this.http.get(
      `${MICROSERVICE_URL}/corporate-net-banking${payload}&uploadType=BULK${
        status ? '&status=' + status : ''
      }${corporateId ? '&corporateId=' + corporateId : ''}`,
    );
  }

  fetchAccountDetails(mobileNo: string) {
    return this.http.get(
      `${MICROSERVICE_URL}/retail-fund-transfer/fetchDashBoardAccountDetails?mobileNo=${mobileNo}`,
    );
  }

  /**
   * This method will call the service to fetch account balance from flex cube
   * @param accountNumber
   * @returns
   */
  fetchAccountBalance(accountNo: string) {
    return this.http.get<IcHttpResponseModel<FlexBalanceModel>>(
      `${MICROSERVICE_URL}/flex-service/queryBalance?originationAccNo=${accountNo}`,
    );
  }
}
