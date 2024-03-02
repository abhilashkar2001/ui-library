import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class BulkUploadServiceService {
  basePath = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  processBulkTransaction(payload) {
    console.log(payload);
    return this.http.post<any>(
      `${this.basePath}/corporate-net-banking/approve-fund-transfer-bulk-upload-data`,
      payload
    );
  }
}
