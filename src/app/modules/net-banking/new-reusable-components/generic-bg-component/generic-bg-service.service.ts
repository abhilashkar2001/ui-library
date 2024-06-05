import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class GenericBgServiceService {
  basePath = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  fetchPincode(pincode) {
    return this.http.get<any>(
      `${this.basePath}/city/fetchByPinCode?pincode=${pincode}`
    );
  }

  uploadDocument(payload) {
    return this.http.post<any>(`${this.basePath}/upload-document`, payload);
  }

  saveTemplate(payload) {
    return this.http.post<any>(`${this.basePath}/bgIssuance`, payload);
  }

  submitIssuance(payload) {
    return this.http.post<any>(`${this.basePath}/lcMaster`, payload);
  }
}
