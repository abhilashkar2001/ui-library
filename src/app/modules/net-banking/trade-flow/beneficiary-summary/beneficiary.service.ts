import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class BeneficiaryService {
  protected basePath = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  getAllCountry() {
    return this.http.get<any>(`${this.basePath}/country`);
  }

  saveBeneficiary(payload) {
    return this.http.post<any>(`${this.basePath}/benieficiary`, payload);
  }

  getBeneficiaryById(id) {
    return this.http.get<any>(
      `${this.basePath}/benieficiary?benificiaryId=${id}`
    );
  }
  getDataByPage(filterBy, filterValue, page, size, sortName, direction) {
    const filter = `${filterBy}=${filterValue}`;
    const pagination = `size=${size}&page=${page}`;
    const sortOperation = `sort=${sortName}&sortOrder=${direction}`;
    const payload =
      sortName && filterBy
        ? `?${filter}&${sortOperation}&${pagination}`
        : sortName
        ? `?${sortOperation}&${pagination}`
        : page && size
        ? filterBy
          ? `?${filter}&${pagination}`
          : `?${pagination}`
        : "";
    return this.http.get<any>(`${this.basePath}/benieficiary${payload}`);
  }
}
