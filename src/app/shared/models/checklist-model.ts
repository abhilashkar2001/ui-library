import { IcHttpResponseModel } from "./ic-http-response.model";

export interface ChecklistModel extends IcHttpResponseModel {
  data: ChecklistInfoModel[];
}

export interface ChecklistInfoModel {
  id: number;
  seq: number;
  document: string;
  summary: string;
  mandatoryForNxtStg: boolean;
  mandatoryForApproval: boolean;
  docRequired: boolean;
  documentTypes: string;
  docInfoModel: DocInfoModel[];
  originationId: number;
}

export interface DocInfoModel {
  documentId: number;
  documentName: any;
  documentType: any;
  fileName: string;
  fileType: string;
  documentSide: any;
  verificationType: any;
  fileUrl: string;
  idNumber: any;
  phoneNumber: any;
  documentNumber: any;
  issueDate: any;
  expiryDate: any;
  dob: any;
  documentDesc: string;
  isProofOfAddress: any;
  documentNameValue: any;
  documentNameForChecklist: string;
}

export interface ChecklistRouteObjModel {
  checklistItem: string[] | string | any;
  processStageId: number | string;
  screenId: number | string;
  processCycleCode: string;
}

export class ChecklistPayloadModel {
  originationId: number;
  documentIds: number[];
  screenCode: number | string;
}
