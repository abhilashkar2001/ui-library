import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

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
    const bgUrl = this.getBgUrl(moduleName);
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
    const filter = `${filterEndpoint}`;
    const pagination = `page=${page}&size=${size}`;

    const sortOperation = `sort=${sortName}&sortOrder=${direction}`;

    const payload = `?${pagination}`;
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
}
