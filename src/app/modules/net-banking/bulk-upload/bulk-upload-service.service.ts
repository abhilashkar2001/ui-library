import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class BulkUploadServiceService {
  basePath = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  processBulkTransaction(payload) {
    return this.http.post<any>(
      `${this.basePath}/corporate-net-banking/approve-fund-transfer`,
      payload
    );
  }

  getLevelApprovalStatus(bulkTransactionId, className: string) {
    return this.http.get<any>(
      `${this.basePath}/corporate-net-banking/fetchApprovalHistory?className=${className}&id=${bulkTransactionId}`
    );
  }

  getBulkUploadRecords(id, filters?) {
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
      `${this.basePath}/corporate-net-banking?module=coprateNetBankingInfo&buklUploadId=${id}${filterEndpoint}`
    );
  }

  updateRemark(remarkData) {
    return this.http.put<any>(
      `${this.basePath}/corporate-net-banking/updateStatusAndRemark`,
      remarkData
    );
  }

  downloadBulkUpload(id) {
    return this.http.get<any>(
      `${this.basePath}/corporate-net-banking/download?id=${id}`,
      { responseType: "blob" as "json" }
    );
  }

  uploadExcel(formData, userName, type: string, processingDate) {
    return this.http.post(
      `${this.basePath}/corporate-net-banking/upload?productType=${type}&userName=${userName}`,
      formData
    );
  }

  downloadBulkuploadParentSummary() {
    return this.http.get<any>(
      `${this.basePath}/corporate-net-banking/downloadBulk`,
      { responseType: "blob" as "json" }
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
