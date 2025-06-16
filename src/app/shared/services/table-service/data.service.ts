import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface ErrorPayload {
  code: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private subject = new Subject<any>();

  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  private auditLogData: any = {};

  getAuditLogData() {
    return this.auditLogData;
  }

  /** Checklist behavioral subject */
  private $checklistDocument: BehaviorSubject<
    Map<string, Record<string, any>> | null | any
  > = new BehaviorSubject<Map<string, Record<string, any>>>(new Map());

  /**
   * store uploaded checklist document in behaviour subject for save later
   * @param document list of the document uploaded
   */
  setChecklistDocument(key: string, value: Record<string, any>): void {
    this.$checklistDocument.value.set(key, value);
  }

  /**
   * get the list of checklist stored
   * @returns the list of checklist
   */
  getChecklistDocument(): Map<string, Record<string, any>> | any {
    return this.$checklistDocument.value;
  }

  /**
   * set the empty array in the checklist behavioral subject
   */
  removeChecklistDocument(): void {
    this.$checklistDocument.next(new Map());
  }

  $disbursementDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  /**
   * store uploaded checklist document in behaviour subject for save later
   * @param document list of the document uploaded
   */
  setDisbursementDetails(value: Record<string, any>): void {
    this.$disbursementDetails.next(value);
  }

  /**
   * disbursement details get from stored observable
   * @returns disbursement details
   */
  getDisbursementDetails(): Record<string, any> {
    return this.$disbursementDetails.value;
  }

  /**
   * null to disbursement details
   */
  removeDisbursementDetails(): void {
    this.$disbursementDetails.next(null);
  }
}
