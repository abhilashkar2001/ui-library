import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FACTORYPOPULATE } from 'app/shared/models/factory-populate.models';
import { GETGENERICVALUE } from 'app/shared/models/generic-value.model';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';

const baseUrl = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private addNewUploadSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  addNewUpload() {
    this.addNewUploadSubject.next();
  }

  getNewUploadClicked() {
    return this.addNewUploadSubject.asObservable();
  }

  getLoanTypes(categoray: any): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/basis-class/fetchAllWebsiteProduct?category=${categoray}`,
    );
  }

  getSubLoanTypes(subAccount: string): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/details/fetchSubClass?basisClass=${subAccount}&website=true`,
    );
  }

  getExistingUserDetails(mobileNumber: string): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/fetchExistingCustomer?mobile=${mobileNumber}`,
    );
  }

  saveLoanPersonaldetails(loanDetails: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/loan-account/save`, loanDetails);
  }

  getLoanSummary(originationId: any): Observable<any> | any {
    return this.http.get(
      `${baseUrl}/webSummary?originationId=${originationId}`,
    );
  }

  submitLoanDetail(payload: any) {
    return this.http.post<any>(`${baseUrl}/webDisbursement`, payload);
  }
  getLoanById(id: any) {
    return this.http.get<any>(`${baseUrl}/webDisbursement/findById?id=${id}`);
  }
  saveLoanPersonal(loanDetails: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/customer/joint`, loanDetails);
  }

  getProcessStage(processCode: any) {
    // https://192.168.0.127:8765/process_cycle/stages?processCycleCode
    return this.http.get<any>(
      `${baseUrl}/process_cycle/stages?processCycleCode=${processCode}`,
    );
  }
  updateOrigination(data: any) {
    return this.http.put<any>(`${baseUrl}/webDisbursement`, data);
  }

  verifyWorkFlow(flowData: any) {
    return this.http.post<any>(`${baseUrl}/workflow/verify`, flowData);
  }

  saveLoanApprovalConfig(approvalDetails: any) {
    return this.http.post<any>(
      `${baseUrl}/loan-account/saveLoanApprovalConfig`,
      approvalDetails,
    );
  }

  genericValue(screenName: string | string[], genericName: string[] | number) {
    return this.http.get<any>(
      `${baseUrl}/generic-value?screenName=${screenName}&genericName=${genericName}`,
    );
  }
  triggerloanDetailsEmail(formdata: any) {
    return this.http.post(`${baseUrl}/email`, formdata, {
      responseType: 'text',
    });
  }
  getAllState() {
    return this.http.get(
      `${baseUrl}/state?authStatus=AUTHORIZED&recordStatus=OPEN`,
    );
  }
  getAllCity() {
    return this.http.get(
      `${baseUrl}/city?authStatus=AUTHORIZED&recordStatus=OPEN`,
    );
  }

  getAccountList(customerNumber: any) {
    return this.http.get<any>(
      `${baseUrl}/customer/accountInfo?customerNo=${customerNumber}`,
    );
  }
  getOriginationMaster(id: any) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser?originationId=${id}`,
    );
  }

  checkAccountNumberAvilable(accountNumber: any) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/accountNumber?accountNumber=${accountNumber}`,
    );
  }

  getProductDetails(basisId: any) {
    return this.http.get<any>(`${baseUrl}/basis-detail?id=${basisId}`);
  }

  getProductAspectDetails(basisId: any) {
    return this.http.get<any>(
      `${baseUrl}/aspects-lending?basisDetailId=${basisId}`,
    );
  }

  checkMobileAndProduct(productCode: any, mobileNo: any, accountType: any) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/checkMobileAndProduct?productCode=${productCode}&mobileNo=${mobileNo}&accountType=${accountType}`,
    );
  }

  getProductInterestDetails(basisId: number) {
    return this.http.get<any>(
      `${baseUrl}/interestDetail/formulaElement?basisId=${basisId}`,
    );
  }

  fetchStateCityByZipcode(pincode: number) {
    return this.http.get(`${baseUrl}/city/fetchByPinCode?pincode=${pincode}`);
  }

  getCustomerByCif(id: number) {
    return this.http.get<GETGENERICVALUE | FACTORYPOPULATE>(
      `${baseUrl}/customer-api?customerNo=${id}`,
    );
  }
  stageSavePersonalDetails(personalDetails: any): Observable<any> | any {
    return this.http.post(
      `${baseUrl}/origination-matser/customerStagingSave`,
      personalDetails,
    );
  }
  getCustByStageId(id: number) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/fetchCustomerStaging?customerStageId=${id}`,
    );
  }

  getEmiCalculation(payload: any) {
    return this.http.post(`${baseUrl}/loan-repayment/emi-calculation`, payload);
  }

  fetchInterestDetails(basisId: any) {
    return this.http.get<any>(
      `${baseUrl}/loanInterestAndCharge/interestLoanRates?productCode=${basisId}`,
    );
  }
  getCheckListDoc(stageId: any, screenCode: any) {
    return this.http.get<any>(
      `${baseUrl}/process_stage/fetchCheckListForScreen?stageId=${stageId}&screenCode=${screenCode}`,
    );
  }

  saveChecklist(payload: any) {
    return this.http.post<any>(
      `${baseUrl}/origination-matser/saveChecklist`,
      payload,
    );
  }
  getSavedChecklist(
    originationId: number,
    screenCode?: string,
    stageId?: number,
  ) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/fetchCheckListInfo?originationId=${originationId}&screenCode=${screenCode}&stageId=${stageId}`,
    );
  }
}
