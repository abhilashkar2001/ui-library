import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

@Injectable({
  providedIn: "root",
})
export class DownloadService {
  baseUrl = environment.microServiceURL;
  constructor(private http: HttpClient) {}
  downloadloanDetailDoc(originationId) {
    return this.http.get(
      `${this.baseUrl}/webSummary/download?originationId=${originationId}`,
      { responseType: "arraybuffer" }
    );
  }
  downloadAccountDetailDoc(originationId) {
    return this.http.get(
      `${this.baseUrl}/webSummary/loan-account-info/Download?originationId=${originationId}`,
      { responseType: "arraybuffer" }
    );
  }
  downloadFdRdDetailDoc(originationId) {
    return this.http.get(
      `${this.baseUrl}/webSummary/FdAndRd/Download?originationId=${originationId}`,
      { responseType: "blob", observe: "response" }
    );
  }
}
