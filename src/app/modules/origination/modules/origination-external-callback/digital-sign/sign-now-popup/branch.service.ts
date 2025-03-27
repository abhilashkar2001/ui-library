import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private sendSign = new BehaviorSubject('');

  constructor(private httpClient: HttpClient) {}
  getEditSign = this.sendSign.asObservable();
  private uploadSign = new BehaviorSubject<any>(null);

  setUploadSign(value: any) {
    this.uploadSign.next(value);
  }

  getUploadSign() {
    console.log('get value', this.uploadSign.asObservable());
    return this.uploadSign.asObservable();
  }

  // SIMULATE
  /**
   * uploadandProgress Method
   * @param file
   * @returns
   */
  uploadAndProgress(file: File) {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post('https://file.io', formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
  saveUploadSignature(payload: any) {
    return this.httpClient.post(`${MICROSERVICE_URL}/upload-document`, payload);
  }
  saveDigitalSignDetails(payload: any): Observable<any> {
    return this.httpClient.post(
      `${MICROSERVICE_URL}/origination-matser/saveDigitalSign`,
      payload,
    );
  }

  saveSignLater(id: any) {
    return this.httpClient.get<any>(
      `${MICROSERVICE_URL}/signLaterSendEmail?originationId=${id}`,
    );
  }
  fetchApproveDetailsService(id: any) {
    return this.httpClient.get<any>(
      `${MICROSERVICE_URL}/fetchOfferAcceptRejectSummary/approvalStageSummary?originationId=${id}`,
    );
  }
  fetchSignImage(id: any) {
    return this.httpClient.get<any>(
      `${MICROSERVICE_URL}/origination-matser/fetchDigitalSign?originationId=${id}`,
    );
  }
  sendEditsign(signid: any) {
    this.sendSign.next(signid);
  }
  saveCustomerSign(payload: any): Observable<any> {
    return this.httpClient.post(
      `${MICROSERVICE_URL}/customer-api/saveCustStageSignature`,
      payload,
    );
  }
  fetchCustomerSign(id: any) {
    return this.httpClient.get<any>(
      `${MICROSERVICE_URL}/customer-api/customerStageSignature/fetch-by-id?customerStagingId=${id}`,
    );
  }
  getOfferIssueSign(originationId: number) {
    return this.httpClient.get<any>(
      `${MICROSERVICE_URL}/origination-matser/fetchOfferIssueSign?originationId=${originationId}`,
    );
  }
  saveIssuerSignature(payload: {
    originationId: any;
    signatureId: any;
    screenCode: number;
  }) {
    return this.httpClient.post(
      `${MICROSERVICE_URL}/origination-matser/saveOfferIssueSign`,
      payload,
    );
  }
  downloadOfferletter(originationId: number) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.httpClient.get(
      `${MICROSERVICE_URL}/origination-matser/fetchEmail?originationId=${originationId}`,
      httpOptions,
    );
  }
}

//  const formData: FormData = new FormData();
//  formData.append("subject", "Digital Sign Link");
//  formData.append(
//    "body",
//    `Please find the below link to continue with digital sign.
//           ${environment.websiteUrl}?originationId=${
//      this.originationId
//    }&code=${this.tokenStorageService.getToken()}&route=digital-sign
//           `
//  );
//  formData.append("to");
