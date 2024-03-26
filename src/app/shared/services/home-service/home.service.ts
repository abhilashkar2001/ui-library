import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const baseUrl = environment.microServiceURL;
@Injectable({
  providedIn: "root",
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getAccountTypes(newAccount) {
    return this.http.get(`${baseUrl}/basis-class?businessSuite=${newAccount}`);
  }

  getCountryCurrency(branchCode) {
    return this.http.get(
      `${baseUrl}/branch/currencyByBranch?branchCode=${branchCode}`
    );
  }
}
