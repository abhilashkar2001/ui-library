import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class OfferIssueService {
  summary: any;
  constructor(private http: HttpClient) {}

  fetchOfferIssueSummary(originationId: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/issue-stage?originationId=${originationId}`,
    );
  }

  downloadOfferletter(originationId: number) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.http.get(
      `${MICROSERVICE_URL}/origination-matser/fetchEmail?originationId=${originationId}`,
      httpOptions,
    );
  }

  saveCustomerRequest(payload: any) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/issue-stage/saveCusomerRequest`,
      payload,
    );
  }

  postOfferAcceptRejectDetails(payload: any) {
    return this.http.put<any>(
      `${MICROSERVICE_URL}/origination-matser/updateOfferAcceptAndReject`,
      payload,
    );
  }

  public saveCustomeDocuments(data: any) {
    return this.http.post<any>(`${MICROSERVICE_URL}/documents`, data);
  }
}
