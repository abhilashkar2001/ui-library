import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomWebDocUploadServiceService {
  baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  getCheckListDoc(
    docName: any,
    originationId: any,
    fileDesc: any,
    documentId: any,
    custStagingId: any,
  ) {
    return this.http.post<any>(
      `${this.baseUrl}/pyDocument/save?originationId=${originationId}&documnetName=${docName}&documentId=${documentId}&customerId=${custStagingId}`,
      fileDesc,
    );
  }
}
