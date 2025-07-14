import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IcHttpResponseModel, IProducts, IScreenInfo } from '@onerumango/utils';
import { BasisSubClassModel } from 'app/shared/models/website-product.model';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { AspectLendings } from '../../models/origination/aspect-lending.model';
import { IProcessStage } from '@onerumango/utils/lib/models/process-stage.model';
import {
  CustomerCategoryResponse,
  EmiCalculationPayload,
  InterestRateResponse,
} from 'app/modules/loan/emi-calculator/emi-calculator-model';

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
    return this.http.get<IcHttpResponseModel<BasisSubClassModel>>(
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

  verifyWorkFlow(flowData: any) {
    return this.http.post<any>(`${baseUrl}/workflow/verify`, flowData);
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

  getPersonalDetailsData(id: any) {
    return this.http.get<any>(
      `${baseUrl}/loan-detail/fetch-personal-details?originationId=${id}`,
    );
  }

  savePersonalDetails(personalDetails: any) {
    return this.http.post<any>(
      `${baseUrl}/loan-detail/personal-details`,
      personalDetails,
    );
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

  getCustByStageId(id: number) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/fetchCustomerStaging?customerStageId=${id}`,
    );
  }

  getEmiCalculation(payload: EmiCalculationPayload) {
    return this.http.post(`${baseUrl}/loan-repayment/emi-calculation`, payload);
  }

  getCheckListDoc(stageId: any, screenCode: any, originationId: number) {
    return this.http.get<any>(
      `${baseUrl}/process_stage/fetchCheckListForScreen?stageId=${stageId}&screenCode=${screenCode}&originationId=${originationId}`,
    );
  }

  getCheckListDocNoOrigination(stageId: any, screenCode: any) {
    return this.http.get<any>(
      `${baseUrl}/process_stage/fetchCheckListForScreen?stageId=${stageId}&screenCode=${screenCode}`,
    );
  }

  /**
   * This method will save the checklist for particular screen
   * @param payload
   * @returns
   */
  saveChecklist(payload: any) {
    return this.http.post<any>(`${baseUrl}/origination-doc`, payload);
  }

  // DeleteChecklist

  deleteCheckList(documentId: number, originationId: number) {
    return this.http.delete<any>(
      `${baseUrl}/origination-doc?documentId=${documentId}&originationId=${originationId}`,
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

  saveLoanDetails(payload: any) {
    return this.http.post<any>(`${baseUrl}/loan-detail`, payload);
  }

  getLoanDetails(originationId: number) {
    return this.http.get<any>(
      `${baseUrl}/loan-detail?originationId=${originationId}`,
    );
  }

  saveBusinessDetails(payload: any) {
    return this.http.post<any>(
      `${baseUrl}/loan-detail/save-business-details`,
      payload,
    );
  }

  getBusinessDetailsById(originationId: number) {
    return this.http.get<any>(
      `${baseUrl}/loan-detail/fetch-business-details/${originationId}`,
    );
  }

  saveCollateralDetails(payload: any) {
    return this.http.post<any>(
      `${baseUrl}/loan-detail/save-collateral`,
      payload,
    );
  }

  getCollateralDetailsId(originationId: number) {
    return this.http.get<any>(
      `${baseUrl}/loan-detail/fetch-collateralInfo?originationId=${originationId}`,
    );
  }

  fetchCheckListSummary(originationId: number) {
    return this.http.get<any>(
      `${baseUrl}/origination-doc?originationId=${originationId}`,
    );
  }

  getProductDetails(basisId: number) {
    return this.http.get<IcHttpResponseModel<IProducts>>(
      `${baseUrl}/origination-product-detail?id=${basisId}`,
    );
  }

  fetchProcessStages(processCycleCode: string) {
    return this.http.get<IcHttpResponseModel<IProcessStage>>(
      `${baseUrl}/process_cycle/stages?processCycleCode=${processCycleCode}&internal=false`,
    );
  }

  fetchScreens(processStageId: number) {
    return this.http.get<IcHttpResponseModel<IScreenInfo>>(
      `${baseUrl}/process_stage/screens?id=${processStageId}`,
    );
  }

  saveTermsandCreditFields(payload: any) {
    return this.http.put<any>(
      `${baseUrl}/loan-detail/updateCreditAndTermsField`,
      payload,
    );
  }

  saveDisbursementDetails(payload: any) {
    return this.http.post(`${baseUrl}/loan-disbursement`, payload);
  }

  fetchDisbursementDetails(originationId: number) {
    return this.http.get(
      `${baseUrl}/loan-disbursement?originationId=${originationId}`,
    );
  }

  fetchParentScreen() {
    return this.http.get(`${baseUrl}/loan-detail/fetch-parent-company`);
  }

  fetchCreditBureau(originationId: number) {
    return this.http.get(
      `${baseUrl}/loan-detail/credit-terms?originationId=${originationId}`,
    );
  }

  updateCreditBureau(payload: any) {
    return this.http.put(
      `${baseUrl}/loan-detail/updateCreditAndTermsField`,
      payload,
    );
  }

  private collateralData = new Subject<any>();
  collateral$ = this.collateralData.asObservable();
  sendCollateralData(data: any) {
    this.collateralData.next(data);
  }
  saveSignature(payload: any) {
    return this.http.post<any>(
      `${baseUrl}/customer-api/saveCustStageSignature`,
      payload,
    );
  }
  fetchCustomerCategories(productCode: string) {
    return this.http.get<CustomerCategoryResponse>(
      `${baseUrl}/interestRate/fetchCategoryIdUsingProductCode?productCode=${productCode}`,
    );
  }
  fetchInterestRateForCustomerCategory(
    productName: string,
    customercategory: string,
    loanAmount: number,
  ) {
    return this.http.get<InterestRateResponse>(
      `${baseUrl}/interestRate/fetchInterest?productName=${productName}&customercategory=${customercategory}&loanAmount=${loanAmount}`,
    );
  }
}
