import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root"
})
export class SharedService {
  protected baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  genericValue(screenName: string, genericName: string[]) {
    return this.http.get<any>(
      `${this.baseUrl}/generic-value?screenName=${screenName}&genericName=${genericName}`
    );
  }

  uploadDocument(formData: any) {
    return this.http.post<any>(`${this.baseUrl}/upload-document`, formData, {
      reportProgress: true,
      observe: "events"
    });
  }

  // Aadhaar Front API
  // public readAadharData(data) {
  //   return this.http.post<any>(`${this.baseUrl}/ocr/process`, data);
  // }
  public readAadharFrontData(data: any) {
    return this.http.post<any>(`${this.baseUrl}/api/scan-adhar-front`, data);
  }

  // Aadhaar Back API
  public readAadhaarBackData(data: any) {
    return this.http.post<any>(`${this.baseUrl}/api/scan-adhar-back`, data);
  }

  deleteDocument(documentId: any) {
    return this.http.delete(`${this.baseUrl}/upload-document/${documentId}`);
  }
}
