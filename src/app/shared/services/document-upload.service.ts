import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({ providedIn: 'root' })
export class DocumentUploadService {
  constructor(private httpClient: HttpClient) {}

  uploadDocuments(formData: any) {
    return this.httpClient.post<any>(
      `${MICROSERVICE_URL}/upload-document`,
      formData,
    );
  }

  // DELETE DOCUMENT FOR THE CUSTOMER SERVICE
  deleteDocument(customerStagId: number, documentId: number) {
    return this.httpClient.delete(
      `${MICROSERVICE_URL}/customer-api/deleteCustomerDocInfo?custStageId=${customerStagId}&documentId=${documentId}`,
    );
  }
}
