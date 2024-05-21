import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

const baseUrl = environment.microServiceURL;

@Injectable({
  providedIn: "root",
})
export class LoanService {
  constructor(private http: HttpClient) {}

  getLoanTypes(categoray): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/basis-class/fetchAllWebsiteProduct?category=${categoray}`
    );
  }

  getSubLoanTypes(subAccount: string): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/details/fetchSubClass?basisClass=${subAccount}&website=true`
    );
  }

  getExistingUserDetails(mobileNumber: string): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/fetchExistingCustomer?mobile=${mobileNumber}`
    );
  }

  saveLoanPersonaldetails(loanDetails: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/loan-account/save`, loanDetails);
  }

  getLoanSummary(originationId: any): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/webSummary?originationId=${originationId}`
    );
  }

  submitLoanDetail(payload) {
    return this.http.post<any>(`${baseUrl}/webDisbursement`, payload);
  }
  getLoanById(id) {
    return this.http.get<any>(`${baseUrl}/webDisbursement/findById?id=${id}`);
  }
  saveLoanPersonal(loanDetails: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/customer/joint`, loanDetails);
  }

  getProcessStage(processCode) {
    // https://192.168.0.127:8765/process_cycle/stages?processCycleCode
    return this.http.get<any>(
      `${baseUrl}/process_cycle/stages?processCycleCode=${processCode}`
    );
  }
  updateOrigination(data) {
    return this.http.put<any>(`${baseUrl}/webDisbursement`, data);
  }

  verifyWorkFlow(flowData) {
    return this.http.post<any>(`${baseUrl}/workflow/verify`, flowData);
  }

  saveLoanApprovalConfig(approvalDetails) {
    return this.http.post<any>(
      `${baseUrl}/loan-account/saveLoanApprovalConfig`,
      approvalDetails
    );
  }

  genericValue(screenName: string, genericName: string[]) {
    return this.http.get<any>(
      `${baseUrl}/generic-value?screenName=${screenName}&genericName=${genericName}`
    );
  }
  triggerloanDetailsEmail(formdata) {
    return this.http.post(`${baseUrl}/email`, formdata, {
      responseType: "text",
    });
  }
  getAllState() {
    return this.http.get(
      `${baseUrl}/state?authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }
  getAllCity() {
    return this.http.get(
      `${baseUrl}/city?authStatus=AUTHORIZED&recordStatus=OPEN`
    );
  }

  getAccountList(customerNumber) {
    return this.http.get<any>(
      `${baseUrl}/customer/accountInfo?customerNo=${customerNumber}`
    );
  }
  getOriginationMaster(id) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser?originationId=${id}`
    );
  }

  checkAccountNumberAvilable(accountNumber) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/accountNumber?accountNumber=${accountNumber}`
    );
  }

  getProductDetails(basisId) {
    return this.http.get<any>(`${baseUrl}/basis-detail?id=${basisId}`);
  }

  getProductAspectDetails(basisId) {
    return this.http.get<any>(
      `${baseUrl}/aspects-lending?basisDetailId=${basisId}`
    );
  }

  checkMobileAndProduct(productCode, mobileNo, accountType) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/checkMobileAndProduct?productCode=${productCode}&mobileNo=${mobileNo}&accountType=${accountType}`
    );
  }

  getProductInterestDetails(basisId) {
    return this.http.get<any>(
      `${baseUrl}/interestDetail/formulaElement?basisId=${basisId}`
    );
  }

  fetchStateCityByZipcode(pincode) {
    return this.http.get(`${baseUrl}/city/fetchByPinCode?pincode=${pincode}`);
  }

  getCustomerByCif(id) {
    return this.http.get<any>(`${baseUrl}/customer-api?customerNo=${id}`);
  }
  stageSavePersonalDetails(personalDetails: any): Observable<any> | any {
    return this.http.post(
      `${baseUrl}/origination-matser/customerStagingSave`,
      personalDetails
    );
  }
  getCustByStageId(id) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/fetchCustomerStaging?customerStageId=${id}`
    );
  }

  getEmiCalculation(payload) {
    return this.http.post(`${baseUrl}/loan-repayment/emi-calculation`, payload);
  }

  fetchInterestDetails(basisId) {
    return this.http.get<any>(
      `${baseUrl}/loanInterestAndCharge/interestLoanRates?productCode=${basisId}`
    );
  }
  getCheckListDoc(stageId, screenCode) {
    return this.http.get<any>(
      `${baseUrl}/process_stage/fetchCheckListForScreen?stageId=${stageId}&screenCode=${screenCode}`
    );
  }

  saveChecklist(payload) {
    return this.http.post<any>(
      `${baseUrl}/origination-matser/saveChecklist`,
      payload
    );
  }
  getSavedChecklist(originationId) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/fetchCheckListInfo?originationId=${originationId}`
    );
  }

  departmentMapping(payload) {
    return this.http.post<any>(
      `${baseUrl}//origination-matser/loanDept-mapping-save`,
      payload
    );
  }
}
