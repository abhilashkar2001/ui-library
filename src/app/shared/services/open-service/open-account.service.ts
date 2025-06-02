import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

const baseUrl = environment.microServiceURL;
@Injectable({
  providedIn: 'root',
})
export class OpenAccountService {
  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) {}

  getOtp(mobile: string): Observable<any> | any {
    return this.http.post(`${baseUrl}/auth/generateOtp`, { mobile });
  }

  verifyOtp(otpObject: any) {
    return this.http.post(`${baseUrl}/auth/verifyOtp`, otpObject);
  }

  uploadDocument(documentObjects: any): Observable<any> | any {
    return this.http.post(`${baseUrl}/upload-document`, documentObjects);
  }

  uploadMultipleDocument(documentObjects: any): Observable<any> | any {
    return this.http.post(
      `${baseUrl}/documents?source=web Site`,
      documentObjects,
    );
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

  getExistingCustomer(mobileNo: any, type?: any) {
    return this.http.get(
      `${baseUrl}/customer-api?mobile=${mobileNo}${
        type ? `&type=${type}` : ''
      }`,
    );
  }

  saveCustomerInfo(payload: any) {
    return this.http.post<any>(`${baseUrl}/origination-matser/save`, payload);
  }

  fetchSubClass(subClass: any) {
    return this.http.get<any>(
      `${baseUrl}/details/fetchSubClass?basisClass=${subClass}`,
    );
  }

  getProcessCycle(processName: any) {
    return this.http.get<any>(
      `${baseUrl}/process_cycle/stages?processCycleCode=${processName}&internal=false`,
    );
  }
  getProcessStages(id: any) {
    return this.http.get<any>(`${baseUrl}/process_stage/screens?id=${id}`);
  }

  getCustomerById(id: number) {
    return this.http.get<any>(`${baseUrl}/customer-api?customerId=${id}`);
  }

  getCustByStageId(id: any) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/fetchCustomerStaging?customerStageId=${id}`,
    );
  }

  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData(): Observable<any> {
    return this.dataSubject.asObservable();
  }
  fetchBoundariesDetails(productId: number) {
    return this.http.get<any>(`${baseUrl}/boundaries?productId=${productId}`);
  }

  getProductDetails(basisId: any) {
    return this.http.get<any>(`${baseUrl}/basis-detail?id=${basisId}`);
  }
  checkMobileAndProduct(productCode: any, mobileNo: any, accountType: any) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser/checkMobileAndProduct?productCode=${productCode}&mobileNo=${mobileNo}&accountType=${accountType}`,
    );
  }
  getOriginationMaster(id: any) {
    return this.http.get<any>(
      `${baseUrl}/origination-matser?originationId=${id}`,
    );
  }

  fetchCompanyDetails() {
    return this.http.get('assets/json/company-information.json');
  }

  // Register a face
  faceRegister(data: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/auth/faceid/register`, data);
  }

  faceMatch(payload: any) {
    return this.http.post<any>(`${baseUrl}/api/face-match-from-doc`, payload);
  }
}
