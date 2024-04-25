import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const baseUrl = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getAccountTypes(categoray) {
    return this.http.get(
      `${baseUrl}/basis-class/fetchAllWebsiteProduct?category=${categoray}`
    );
  }

  getCountryCurrency(branchCode) {
    return this.http.get(
      `${baseUrl}/branch/currencyByBranch?branchCode=${branchCode}`
    );
  }
}
