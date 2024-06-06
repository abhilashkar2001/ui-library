import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class CustomWebDocUploadServiceService {
  baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  getCheckListDoc(docName, originationId, fileDesc, documentId) {
    return this.http.post<any>(
      `${this.baseUrl}/extract-doc?originationId=${originationId}&documnetName=${docName}&documentId=${documentId}`,
      fileDesc
    );
  }
}
