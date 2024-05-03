import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class BeneficiaryService {
  protected basePath = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  uploadBenificiaryExcel(formData) {
    return this.http.post(
      `${this.basePath}/corp_benieficiary/uploadBeneficiary`,
      formData
    );
  }

  getBulkUploadRecords(refNumber, filters?) {
    var filterBy = "";
    if (filters?.filterBy) {
      const keys = Object.keys(filters.filterBy);
      keys.forEach((key) => {
        if (filters.filterBy[key])
          filterBy = filterBy + `${key}=${filters.filterBy[key]}&`;
      });
    }
    const page = filters?.page
      ? `page=${filters?.page}&size=${filters?.size}`
      : "";
    const sort = filters?.sort ? `&sort=${filters?.sort}` : "";
    const direction = filters?.direction
      ? `&sortOrder=${filters?.direction}`
      : "";
    var filterEndpoint = `&${filterBy}${page}${sort}${direction}`;
    if (!filters) filterEndpoint = "";

    return this.http.get<any>(
      `${this.basePath}/corp_benieficiary?refNumber=${refNumber}${filterEndpoint}`
    );
  }

  getSummary(
    filterBy,
    filterValue,
    page,
    size,
    sortName,
    direction,
    moduleName
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
    const filter = `${filterEndpoint}`;
    const pagination = `page=${page}&size=${size}`;

    const sortOperation = `sort=${sortName}&sortOrder=${direction}`;

    const payload = `?${pagination}`;
    return this.http.get(
      `${this.basePath}/corp_benieficiary/fetchMasterInfo${payload}`
    );
  }

  downloadBenificiaryTemplate() {
    return this.http.get(
      `${this.basePath}/corp_benieficiary/downloadTemplate?filename=Upload`,
      {
        responseType: "blob",
      }
    );
  }

  getAllCountry() {
    return this.http.get<any>(`${this.basePath}/country`);
  }

  saveBeneficiary(payload) {
    return this.http.post<any>(`${this.basePath}/corp_benieficiary`, payload);
  }

  getBeneficiaryById(id) {
    return this.http.get<any>(
      `${this.basePath}/corp_benieficiary?benificiaryId=${id}`
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
    return this.http.get<any>(`${this.basePath}/corp_benieficiary${payload}`);
  }
}
