import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;
@Injectable({ providedIn: "root" })
export class DocumentUploadService {
  constructor(private httpClient: HttpClient) {}

  // SIMULATE
  uploadAndProgress(file: File) {
    console.log(file);
    var formData = new FormData();
    formData.append("file", file);
    return this.httpClient.post("https://file.io", formData, {
      reportProgress: true,
      observe: "events"
    });
  }

  uploadDocuments(formData: any) {
    return this.httpClient.post<any>(
      `${MICROSERVICE_URL}/upload-document`,
      formData
    );
  }

  uploadDocumentsWitProgressBar(formData: any) {
    return this.httpClient.post<any>(
      `${MICROSERVICE_URL}/upload-document`,
      formData,
      {
        reportProgress: true,
        observe: "events"
      }
    );
  }

  uploadMandateSign(payload: any) {
    return this.httpClient.post(
      `${MICROSERVICE_URL}/acc-mandate-details/saveMandateSign`,
      payload
    );
  }

  getSignatureInfo(customerId: any) {
    return this.httpClient.get(`
    ${MICROSERVICE_URL}/signature/customerStageSignature/fetch-by-id/${customerId}
    `);
  }
}
