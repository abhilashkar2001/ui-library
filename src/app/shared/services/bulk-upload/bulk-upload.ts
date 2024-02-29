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
  uploadExcel(formData) {
    return this.http.post(
      `${this.basePath}/maintBulkUpload/uploadDoc`,
      formData
    );
  }

  downloadTemplate(screenName: string): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({
      "Content-Type": "assets/json/maintenance-upload.json",
    });
    return this.http.get(
      `${this.basePath}/maintBulkUpload/downloadTemplate?screenName=${screenName}`,
      {
        headers: headers,
        responseType: "blob",
        observe: "response",
      }
    );
  }
}
