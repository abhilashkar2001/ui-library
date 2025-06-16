import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  protected basePath = environment.microServiceURL;
  private isEditingSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  setEditingStatus(status: boolean) {
    this.isEditingSubject.next(status);
  }

  getCreatedBy(classname: any, module: any) {
    return this.http.get(
      `${this.basePath}/auditLog/createdBy?className=${classname}&module=${module}`,
    );
  }

  getApprovalHistory(className: string, id: number) {
    return this.http.get(
      `${this.basePath}/fromToTillVault/approvalHistory?className=${className}&id=${id}`,
    );
  }

  downloadRecord(className: any, type: any, payload: any, module: any) {
    return this.http.post(
      `${this.basePath}/downaload?className=${className}&module=${module}&type=${type}`,
      payload,
      { responseType: 'blob' },
    );
  }
}
