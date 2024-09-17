import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BgSummaryServiceService {
  basePath = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  getSummaryDetails(
    filterBy,
    filterValue,
    page,
    size,
    sortName,
    direction,
    moduleName,
    url
  ) {
    var filterEndpoint = "";
    if (filterBy) {
      const keys = Object.keys(filterBy);
      keys.forEach((key) => {
        if (filterBy[key])
          key == "newFilter"
            ? (filterEndpoint = filterEndpoint + `branchCode=${filterBy[key]}&`)
            : (filterEndpoint = filterEndpoint + `${key}=${filterBy[key]}&`);
      });
    }
    const pagination = `page=${page}&size=${size}`;
    const payload = `${pagination}`;
    return this.http.get<any>(`${this.basePath}/${url}${payload}`);
  }

  getBgUrl(moduleName) {
    switch (moduleName) {
      case "BG Issuance":
        return "bgIssuance/fetchApplicantInfo";
      case "Remittance":
        return "";

      default:
        break;
    }
  }

  getSummaryUrls() {
    return this.http.get<any>("assets/json/summaryHelper.json");
  }

  fetchApplicantInfo(bgMasterId: number) {
    return this.http.get(
      `${this.basePath}/bankGuarantee/fetchBgMaster?bgMasterId=${bgMasterId}`
    );
  }

  fetchBgInfo(bgMasterId: number): Observable<IcHttpResponseModel<any>> {
    return this.http.get<IcHttpResponseModel<any>>(
      `${this.basePath}/bankGuarantee/fetchBgInfo?bgMasterId=${bgMasterId}`
    );
  }

  fetchOtherInfo(bgMasterId: number) {
    return this.http.get(
      `${this.basePath}/bankGuarantee/fetchOtherInfo?bgMasterId=${bgMasterId}`
    );
  }

  fetchAttachments(bgMasterId: number) {
    return this.http.get(
      `${this.basePath}/bankGuarantee/fetchAttachment?bgMasterId=${bgMasterId}`
    );
  }
}
