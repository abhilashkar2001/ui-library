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
  downloadDetailDoc(originationId) {
    return this.http.get(
      `${this.baseUrl}/webSummary/Download?originationId=${originationId}`,
      { responseType: "arraybuffer" }
    );
  }
}
