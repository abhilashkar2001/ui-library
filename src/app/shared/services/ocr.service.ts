import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: "root"
})
export class OCRService {
  constructor(private http: HttpClient) {}

  public readAadharData(data: any) {
    return this.http.post<any>(`${MICROSERVICE_URL}/ocr/process`, data);
  }

  public fetchOtp(name: any, number: any) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/external/auto?documentName=${name}&documentNo=${number}`
    );
  }

  public readPanData(file: any) {
    return this.http.post<any>(`${MICROSERVICE_URL}/api/scan-pan`, file);
  }

  public readPassportData(file: any) {
    return this.http.post<any>(`${MICROSERVICE_URL}/api/scan-passport`, file);
  }
}
