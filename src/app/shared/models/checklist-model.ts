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
  processStageId: number | string | any;
  screenId: number | string | any;
  processCycleCode: string | any;
}

export class ChecklistPayloadModel {
  originationId: number | any;
  documentIds: number[] | any;
  screenCode: number | string | any;
}
