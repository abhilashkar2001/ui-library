import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BeneficiaryService {
  protected basePath = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  uploadBenificiaryExcel(formData: any) {
    return this.http.post(
      `${this.basePath}/corp_benieficiary/uploadBeneficiary`,
      formData,
    );
  }

  getBulkUploadRecords(refNumber: any, filters?: any) {
    let filterBy = '';
    if (filters?.filterBy) {
      const keys = Object.keys(filters.filterBy);
      keys.forEach((key) => {
        if (filters.filterBy[key])
          filterBy = filterBy + `${key}=${filters.filterBy[key]}&`;
      });
    }
    const page = filters?.page
      ? `page=${filters?.page}&size=${filters?.size}`
      : '';
    const sort = filters?.sort ? `&sort=${filters?.sort}` : '';
    const direction = filters?.direction
      ? `&sortOrder=${filters?.direction}`
      : '';
    let filterEndpoint = `&${filterBy}${page}${sort}${direction}`;
    if (!filters) filterEndpoint = '';

    return this.http.get<any>(
      `${this.basePath}/corp_benieficiary?refNumber=${refNumber}${filterEndpoint}`,
    );
  }

  getSummary(filterBy: any, page: any, size: any) {
    let filterEndpoint = '';
    if (filterBy) {
      const keys = Object.keys(filterBy);
      keys.forEach((key) => {
        if (filterBy[key])
          key == 'newFilter'
            ? (filterEndpoint = filterEndpoint + `branchCode=${filterBy[key]}&`)
            : (filterEndpoint = filterEndpoint + `${key}=${filterBy[key]}&`);
      });
    }
    const pagination = `page=${page}&size=${size}`;

    const payload = `?${pagination}`;
    return this.http.get(
      `${this.basePath}/corp_benieficiary/fetchMasterInfo${payload}`,
    );
  }

  downloadBenificiaryTemplate() {
    return this.http.get(
      `${this.basePath}/corp_benieficiary/downloadTemplate?filename=Upload`,
      {
        responseType: 'blob',
      },
    );
  }

  getAllCountry() {
    return this.http.get<any>(`${this.basePath}/country`);
  }

  saveBeneficiary(payload: any) {
    return this.http.post<any>(`${this.basePath}/corp_benieficiary`, payload);
  }

  getBeneficiaryById(id: any) {
    return this.http.get<any>(
      `${this.basePath}/corp_benieficiary?benificiaryId=${id}`,
    );
  }
  getDataByPage(
    filterBy: any,
    filterValue: any,
    page: any,
    size: any,
    sortName: any,
    direction: any,
  ) {
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
            : '';
    return this.http.get<any>(`${this.basePath}/corp_benieficiary${payload}`);
  }

  checkCorpAccountNumber(accNo: any) {
    return this.http.get<any>(
      `${this.basePath}/corp_benieficiary/checkExistingAccont?accountNumber=${accNo}`,
    );
  }

  fetchBankCode(searchValue: any) {
    return this.http.get<any>(
      `${this.basePath}/retail-beneficiary/fetchOtherBankInfo${
        searchValue ? `?searchValue=${searchValue}` : ''
      }`,
    );
  }
}
