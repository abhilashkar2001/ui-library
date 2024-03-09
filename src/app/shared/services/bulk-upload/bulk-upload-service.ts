import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BulkUpload {
  protected basePath = environment.microServiceURL;

  constructor(private http: HttpClient) { }

  upload(formData, userName, type: string, processingDate, screenName: string) {
    if (screenName === 'beneficiary') {
      return this.uploadBenificiaryExcel(formData);
    } else {
      return this.uploadExcel(formData, userName, type, processingDate);
    }
  }

  uploadBenificiaryExcel(formData) {
    return this.http.post(`${this.basePath}/benieficiary/uploadBeneficiary`, formData);
  }

  uploadExcel(formData, userName, type: string, processingDate) {
    return this.http.post(
      `${this.basePath}/corporate-net-banking/upload?productType=${type}&userName=${userName}`,
      formData
    );
  }

  downLoadTemplateforBulk(screenName: string) {
    if (screenName === 'beneficiary') {
      return this.downloadBenificiaryTemplate();
    } else {
      return this.downloadTemplate();
    }
  }

  downloadBenificiaryTemplate() {
    return this.http.get(
      `${this.basePath}/benieficiary/downloadTemplate?filename=Upload`,
      {
        responseType: "blob",
      }
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
