import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { GenericValueInfoModel } from '../models/generic-value.model';
import { IcHttpResponseModel } from '../models/ic-http-response.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  protected baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  genericValue(screenName: string, genericName: string[]) {
    return this.http.get<IcHttpResponseModel<GenericValueInfoModel>>(
      `${this.baseUrl}/generic-value?screenName=${screenName}&genericName=${genericName}`,
    );
  }

  uploadDocument(formData: FormData) {
    return this.http.post(`${this.baseUrl}/upload-document`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public readAadharFrontData(data: FormData) {
    return this.http.post(`${this.baseUrl}/api/scan-adhar-front`, data);
  }

  // Aadhaar Back API
  public readAadhaarBackData(data: FormData) {
    return this.http.post(`${this.baseUrl}/api/scan-adhar-back`, data);
  }

  deleteDocument(documentId: number) {
    return this.http.delete(`${this.baseUrl}/upload-document/${documentId}`);
  }
}
