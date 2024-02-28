import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Observable, Subject } from "rxjs";

export interface ErrorPayload {
  code: number;
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class DataService {
  private refresh = new BehaviorSubject(false);
  isRefresh = this.refresh.asObservable();

  doRefresh(data) {
    this.refresh.next(data);
  }
  private subject = new Subject<any>();

  sendClickEvent() {
    this.subject.next();
  }

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  private auditLogData: any = {};

  setAuditLogData(data) {
    this.auditLogData = data;
  }

  getAuditLogData() {
    return this.auditLogData;
  }
}
