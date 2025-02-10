import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
})
export class OCRService {
  constructor(private http: HttpClient) {}

  public readAadharData(data: any) {
    return this.http.post<any>(`${MICROSERVICE_URL}/ocr/process`, data);
  }
}
