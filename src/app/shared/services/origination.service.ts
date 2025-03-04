import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ChecklistInfoModel } from '../models/checklist-model';
import { PrimaryCustomerInfo } from '../models/primary-customer.model';
import { IcHttpResponseModel } from '../models/ic-http-response.model';

const MICROSERVICE_URL = environment.microServiceURL;

@Injectable({
  providedIn: 'root',
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
    stageId: number | string,
  ) {
    const options = {
      params: screenId
        ? new HttpParams().set('screenCode', screenId).set('stageId', stageId)
        : {},
    };
    return this.http.get<IcHttpResponseModel<ChecklistInfoModel[]>>(
      `${MICROSERVICE_URL}/origination-matser/fetchCheckListInfo?originationId=${originationId}`,
      options,
    );
  }

  /**
   * Validate date of birth of primary customer for given origination Id
   * @param originationId orignation in which primary customer present
   * @param dateOfBirth of the primary customer
   * @returns
   */
  validateDateOfBirth(originationId: number, dateOfBirth: string) {
    return this.http.get<IcHttpResponseModel<PrimaryCustomerInfo>>(
      `${MICROSERVICE_URL}/origination-matser/validateDOB?origniationId=${originationId}&dateOfBirth=${dateOfBirth}`,
    );
  }

  verifyWorkflow(properties: any) {
    return this.http.post<any>(
      `${MICROSERVICE_URL}/workflow/verify`,
      properties,
    );
  }

  getCompletedtages(originationId: any) {
    return this.http.get<any>(
      `${MICROSERVICE_URL}/task-summary/requestStatus?originationId=${originationId}`,
    );
  }
}
