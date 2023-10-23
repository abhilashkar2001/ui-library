import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class CreateRdService {
  protected baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  updateRdDetails(rdDetails) {
    return this.http.post<any>(`${this.baseUrl}/reccuringDeposite`, rdDetails);
  }
  getRdfromId(id) {
    return this.http.get(
      `${this.baseUrl}/reccuringDeposite?recurringDepositId=${id}`
    );
  }
  getBusinessSuite(business) {
    return this.http.get<any>(`${this.baseUrl}/basis-class?businessSuite=${business}`)
  }
  getBasisClass(subClass) {
    return this.http.get<any>(
      `${this.baseUrl}/details/fetchSubClass?basisClass=${subClass}`
    );
  }
  saveRdOriginationMaster(payload) { 
    return this.http.post<any>(`${this.baseUrl}/origination-matser/save`,payload)
  }

  getOriginationMaster(id) {
    return this.http.get<any>(`${this.baseUrl}/origination-matser?originationId=${id}`)
  }

  getRdDetails(id) {
    return this.http.get<any>(`${this.baseUrl}/origination-matser/fdRdFetch?fdRdMasterId=${id}`)
  }
  getProcessCycle(processName) {
    return this.http.get<any>(
      `${this.baseUrl}/process_cycle/stages?processCycleCode=${processName}`
    );
  }
   getProcessStages(id) {
    return this.http.get<any>(`${this.baseUrl}/process_stage/screens?id=${id}`);
  }
   getCustomerById(id) {
    return this.http.get<any>(`${this.baseUrl}/customer-api?customerId=${id}`);
  }
  getRdOriginationSummary(id) {
    return this.http.get<any>(`${this.baseUrl}/webSummary/fetchFdAndRdSummary?originationId=${id}`);
  }
}
