import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenStorageService } from "app/shared/token-storage.service";
import { DEFAULT_LOCALE } from "app/shared/helpers/utils";

import { BehaviorSubject } from "rxjs";
import { environment } from "environments/environment";
import * as moment from "moment";
import { DataService } from "./data.service";

@Injectable({
  providedIn: "root",
})
export class TableService {
  _format: string;
  _locale: string;
  currentLocal: any;
  protected basePath = environment.microServiceURL;
  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService,
    private shareService: DataService
  ) {}

  private isEditingSubject = new BehaviorSubject<boolean>(false);
  isEditing$ = this.isEditingSubject.asObservable();

  setEditingStatus(status: boolean) {
    this.isEditingSubject.next(status);
  }

  getCreatedBy(classname, module) {
    return this.http.get(
      `${this.basePath}/auditLog/createdBy?className=${classname}&module=${module}`
    );
  }
  getApprovalHistory(className: string, id: number) {
    return this.http.get(
      `${this.basePath}/fromToTillVault/approvalHistory?className=${className}&id=${id}`
    );
  }
  downloadRecord(className, type, payload, module) {
    return this.http.post(
      `${this.basePath}/downaload?className=${className}&module=${module}&type=${type}`,
      payload,
      { responseType: "blob" }
    );
  }
}
