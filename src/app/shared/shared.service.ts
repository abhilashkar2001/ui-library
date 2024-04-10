import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  protected baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) { }

  genericValue(screenName: string, genericName: string[]) {
    return this.http.get<any>(
      `${this.baseUrl}/generic-value?screenName=${screenName}&genericName=${genericName}`
    );
  }

  uploadDocument(formData) {
    return this.http.post<any>(`${this.baseUrl}/upload-document`, formData, {
      reportProgress: true,
      observe: "events",
    });
  }

  public readAadharData(data) {
    return this.http.post<any>(`${this.baseUrl}/ocr/process`, data);
  }

  deleteDocument(documentId) {
    return this.http.delete(`${this.baseUrl}/upload-document/${documentId}`);
  }
}
