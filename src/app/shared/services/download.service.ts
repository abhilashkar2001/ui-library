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
  downloadFiles(header: any, users: any, downloadFileName?: string) {
    let doc = new jsPDF();
    const body = [];
    const head = [header];
    autoTable(doc, {
      head: head,
      body: users,
      didDrawCell: (prepare) => {},
    });

    doc.save(`${downloadFileName}.pdf`);
  }
  constructor(private http: HttpClient) {}

  downloadDetailDoc(originationId) {
    return this.http.get(
      `${this.baseUrl}/webSummary/Download?originationId=${originationId}`,
      { responseType: "arraybuffer" }
    );
  }
}
