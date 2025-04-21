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
  ) {
    return this.http.post<any>(
      `${this.baseUrl}/pyDocument/savePyDoc?originationId=${originationId}&documnetName=${docName}&documentId=${documentId}`,
      fileDesc,
    );
  }
}
