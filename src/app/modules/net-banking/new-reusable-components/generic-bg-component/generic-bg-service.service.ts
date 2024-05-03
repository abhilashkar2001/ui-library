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
    return this.http.get(
      `${this.basePath}/city/fetchByPinCode?pincode=${pincode}`
    );
  }

  saveTemplate(payload) {
    return this.http.post(`${this.basePath}/bgIssuance`, payload);
  }

  submitIssuance(payload) {
    return this.http.post(`${this.basePath}/lcMaster`, payload);
  }
}
