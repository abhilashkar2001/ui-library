import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
}
