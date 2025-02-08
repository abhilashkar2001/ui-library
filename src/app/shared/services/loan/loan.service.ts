import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FACTORYPOPULATE } from 'app/shared/models/factory-populate.models';
import { GETGENERICVALUE } from 'app/shared/models/generic-value.model';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { IcHttpResponseModel } from '@onerumango/utils';
import { AspectLendings } from '../../models/origination/aspect-lending.model';

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

  getProductAspectDetails(productId: number) {
    return this.http.get<IcHttpResponseModel<AspectLendings>>(
      `${baseUrl}/aspects-lending?productId=${productId}`,
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

  getCustByStageId(id: number) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/fetchCustomerStaging?customerStageId=${id}`,
    );
  }

  getEmiCalculation(payload: any) {
    return this.http.post(`${baseUrl}/loan-repayment/emi-calculation`, payload);
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
