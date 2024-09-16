import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

const baseUrl = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class OpenAccountService {
  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {}

  getOtp(phoneNumber: number): Observable<any> | any {
    return this.http.get(`${baseUrl}/auth/generateOTP?mobile=${phoneNumber}`);
  }

  verifyOtp(otpObject: any) {
    return this.http.post(`${baseUrl}/auth/verifyOTP`, otpObject);
  }

  nationalVerifyOtp(otpObject: any) {
    return this.http.post(`${baseUrl}/auth/verifyOTP`, otpObject);
  }

  savePersonalDetails(personalDetails: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/customer/joint`, personalDetails);
  }

  stageSavePersonalDetails(personalDetails: any): Observable<any> | any {
    return this.http.post(
      `${baseUrl}/origination-matser/customerStagingSave`,
      personalDetails
    );
  }

  uploadDocument(documentObjects: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/upload-document`, documentObjects);
  }

  uploadMultipleDocument(documentObjects: any): Observable<any> | any {
    return this.http.post(
      `${baseUrl}/documents?source=web Site`,
      documentObjects
    );
  }

  getResidentType() {
    return this.http.get(`${baseUrl}/details?businessSuite`);
  }

  getGender() {
    return this.http.get(`${baseUrl}/details?businessSuite`);
  }

  getCity(stateId: number) {
    return this.http.get(`${baseUrl}/city?stateId=${stateId}`);
  }

  getState(countryCode: any) {
    return this.http.get(`${baseUrl}/state?countryCode=${countryCode}`);
  }

  getCountryList() {
    return this.http.get(`${baseUrl}/country`);
  }

  getSubAccountsOfAccounts(subAccount: string) {
    return this.http.get(
      `${baseUrl}/details/fetchSubClass?basisClass=${subAccount}`
    );
  }

  getExistingCustomer(mobileNo, type?) {
    return this.http.get(
      `${baseUrl}/fetchExistingCustomer?mobile=${mobileNo}${
        type ? `&type=${type}` : ""
      }`
    );
  }

  saveCustomerInfo(payload) {
    return this.http.post<any>(`${baseUrl}/origination-matser/save`, payload);
  }

  fetchSubClass(subClass) {
    return this.http.get<any>(
      `${baseUrl}/details/fetchSubClass?basisClass=${subClass}`
    );
  }

  getProcessCycle(processName) {
    return this.http.get<any>(
      `${baseUrl}/process_cycle/stages?processCycleCode=${processName}&internal=false`
    );
  }
  getProcessStages(id) {
    return this.http.get<any>(`${baseUrl}/process_stage/screens?id=${id}`);
  }

  getCustomerById(id) {
    return this.http.get<any>(`${baseUrl}/customer-api?customerId=${id}`);
  }

  getCustByStageId(id) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/fetchCustomerStaging?customerStageId=${id}`
    );
  }

  fetchStateCityByZipcode(pincode) {
    return this.http.get(`${baseUrl}/city/fetchByPinCode?pincode=${pincode}`);
  }

  getAllState() {
    return this.http.get(`${baseUrl}/state`);
  }
  getAllCity() {
    return this.http.get(`${baseUrl}/city`);
  }
  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData(): Observable<any> {
    return this.dataSubject.asObservable();
  }
  fetchBoundariesDetails(basisId: number) {
    return this.http.get<any>(`${baseUrl}/boundaries?basisDetailId=${basisId}`);
  }

  getProductDetails(basisId) {
    return this.http.get<any>(`${baseUrl}/basis-detail?id=${basisId}`);
  }
  checkMobileAndProduct(productCode, mobileNo, accountType) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/checkMobileAndProduct?productCode=${productCode}&mobileNo=${mobileNo}&accountType=${accountType}`
    );
  }
  getOriginationMaster(id) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser?originationId=${id}`
    );
  }

  fetchCompanyDetails() {
    return this.http.get("assets/json/company-information.json");
  }

  // Register a face
  faceRegister(data): Observable<any> {
    return this.http.post<any>(`${baseUrl}/api/faceid/register`, data);
  }
}
