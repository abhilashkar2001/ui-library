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
