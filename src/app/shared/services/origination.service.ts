import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import {
  ChecklistModel,
  ChecklistPayloadModel,
} from "../models/checklist-model";
import {
  PrimaryCustomerInfo,
  PrimaryCustomerModel,
} from "../models/primary-customer.model";

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
  fetchChecklistItem(
    originationId: number,
    screenId: number | string,
    stageId: number | string
  ) {
    return this.http.get<ChecklistModel>(
      `${MICROSERVICE_URL}/origination-matser/fetchCheckListInfo?originationId=${originationId}&screenCode=${screenId}&stageId=${stageId}`
    );
  }

  /**
   * This method will save the checklist for particular screen
   * @param payload
   * @returns
   */
  saveChecklist(payload: ChecklistPayloadModel) {
    return this.http.post<ChecklistModel>(
      `${MICROSERVICE_URL}/origination-matser/saveChecklist`,
      payload
    );
  }

  /**
   * Validate date of birth of primary customer for given origination Id
   * @param originationId orignation in which primary customer present
   * @param dateOfBirth of the primary customer
   * @returns
   */
  validateDateOfBirth(originationId: number, dateOfBirth: string) {
    return this.http.get<PrimaryCustomerModel>(
      `${MICROSERVICE_URL}/origination-matser/validateDOB?origniationId=${originationId}&dateOfBirth=${dateOfBirth}`
    );
  }
}
