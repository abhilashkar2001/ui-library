import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: "root",
})
export class OriginationService {
  constructor(private http: HttpClient) {}

  /**
   * fetch all the checklist mapped with particular screen and uploaded document for the same
   * for particular origination ID
   * @param originationId id of the particular record
   * @param screenCode screen code of with which checklist mapped
   * @returns all the checklist document
   */
  fetchChecklistItem(originationId: number, screenId: number, stageId: number) {
    return this.http.get(
      `${MICROSERVICE_URL}/origination-matser/fetchCheckListInfo?originationId=${originationId}&screenCode=${screenId}&stageId=${stageId}`
    );
  }

  validateDateOfBirth(originationId: number, dateOfBirth: string) {
    return this.http.get(
      `${MICROSERVICE_URL}/origination-matser/validateDOB?origniationId=${originationId}&dateOfBirth=${dateOfBirth}`
    );
  }

  saveChecklist(payload) {
    return this.http.post(
      `${MICROSERVICE_URL}/origination-matser/saveChecklist`,
      payload
    );
  }
}
