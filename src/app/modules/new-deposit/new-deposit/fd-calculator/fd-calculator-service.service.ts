import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FdCalculatorServiceService {
  protected base_url = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  submitFixedDetails(fixedDetails: any) {
    return this.http.post<any>(
      `${this.base_url}/fixed-deposit-details`,
      fixedDetails
    );
  }

  submitFdPersonal(personal: any) {
    return this.http.post<any>(
      `${this.base_url}/fixed-deposit-details/save-fd-customer-info`,
      personal
    );
  }
  getCustomerDetails() {
    return this.http.get<any>(
      `${this.base_url}/fixed-deposit-details/account-details?customerId=10056`
    );
  }
  getFixedDeposit(fixedDepositId: any) {
    return this.http.get<any>(
      `${this.base_url}/fixed-deposit-details?fixedDepositId=${fixedDepositId}`
    );
  }
  getFdTypes(FdServices: string = "Deposit Service"): Observable<any> | any {
    return this.http.get(
      `${this.base_url}/basis-class?businessSuite=${FdServices}`
    );
  }
  fetchSubClass(subClass: any) {
    return this.http.get<any>(
      `${this.base_url}/details/fetchSubClass?basisClass=${subClass}`
    );
  }
  fetchDepositeSummary(originationId: any, depositType: any) {
    return this.http.get(
      `${this.base_url}/webSummary/fetchFdAndRdSummary?originationId=${originationId}&screenName=Book ${depositType}&genericName=DOCUMENTTYPE`
    );
  }
  getOriginationMasterDetails(id: any) {
    return this.http.get<any>(
      `${this.base_url}/origination-matser/fdRdFetch?fdRdMasterId=${id}`
    );
  }
  saveFdOriginationMaster(payload: any) {
    return this.http.post<any>(
      `${this.base_url}/origination-matser/save`,
      payload
    );
  }
  getProcessCycle(processName: any) {
    return this.http.get<any>(
      `${this.base_url}/process_cycle/stages?processCycleCode=${processName}`
    );
  }
  getProcessStages(id: any) {
    return this.http.get<any>(
      `${this.base_url}/process_stage/screens?id=${id}`
    );
  }
  getOriginationMaster(id: any) {
    return this.http.get<any>(
      `${this.base_url}/origination-matser?originationId=${id}`
    );
  }
}
