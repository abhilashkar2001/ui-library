import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class CustomWebDocUploadServiceService {
  baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  getCheckListDoc(stageId, screenCode) {
    // process_stage/fetchCheckListForScreen?stageId=2149&screenCode=174
    return this.http.get<any>("assets/json/net-banking-dashboardInfo.json");
    return this.http.get<any>(
      `${this.baseUrl}/process_stage/fetchCheckListForScreen?stageId=${stageId}&screenCode=${screenCode}`
    );
  }
}
