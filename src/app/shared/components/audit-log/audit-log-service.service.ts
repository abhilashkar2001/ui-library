import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuditLogService {
  protected baseUrl = environment.microServiceURL;
  constructor(private http: HttpClient) {}

  getAuditLogHistory(id, className, page, pageSize) {
    return this.http.get<any>(
      `${
        this.baseUrl
      }/loginApi/${id}/revisions?fetchChanges=true&classname=${className}&curPage=${
        page - 1
      }&pageSize=${pageSize}`
    );
  }
}
