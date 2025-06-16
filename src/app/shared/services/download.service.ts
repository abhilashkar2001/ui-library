import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  baseUrl = environment.microServiceURL;

  constructor(private http: HttpClient) {}

  downloadloanDetailDoc(originationId: number) {
    return this.http.get(
      `${this.baseUrl}/webSummary/download?originationId=${originationId}`,
      { responseType: 'arraybuffer' },
    );
  }

  downloadAccountDetailDoc(originationId: number) {
    return this.http.get(
      `${this.baseUrl}/webSummary/loan-account-info/Download?originationId=${originationId}`,
      { responseType: 'arraybuffer' },
    );
  }

  downloadFdRdDetailDoc(originationId: number) {
    return this.http.get(
      `${this.baseUrl}/webSummary/FdAndRd/Download?originationId=${originationId}`,
      { responseType: 'blob', observe: 'response' },
    );
  }

  /**
   * Create an object url for bolb file and download
   * @param fileUrl url of file to download
   * @param fileName name of the file
   */
  public saveFile(fileUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = environment.microServiceURL + fileUrl;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  /**
   * fetch file from db
   * @param fileUrl url of file
   * @returns return the file
   */
  fetchFile(fileUrl: string) {
    return this.http.get(`${this.baseUrl}${fileUrl}`, {
      responseType: 'arraybuffer',
    });
  }
}
