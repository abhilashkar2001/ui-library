import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BulkUpload {
  protected basePath = environment.microServiceURL;

  constructor(private http: HttpClient) {}
  uploadExcel(formData, type: string, processingDate) {
    return this.http.post(
      `${this.basePath}/corporate-net-banking/upload`,
      formData
    );
  }

  downloadTemplate() {
    return this.http.get(
      `${this.basePath}/corporate-net-banking/downloadTemplate?filename=Upload`,
      {
        responseType: "blob",
      }
    );
  }
}
