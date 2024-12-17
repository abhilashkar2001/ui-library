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
  documentName: string;
  documentType: any;
  fileName: string;
  fileType: string;
  documentSide: any;
  verificationType: any;
  fileUrl: string;
  phoneNumber: number;
  idNumber: number;
  documentNumber: number;
  issueDate: Date;
  expiryDate: Date;
  dob: Date;
  documentDesc: string;
  isProofOfAddress: string;
  documentNameValue: string;
  documentNameForChecklist: string;
}

export interface ChecklistRouteObjModel {
  checklistItem: string[] | string | null;
  processStageId: number | string | null;
  screenId: number | string | null;
  processCycleCode: string | null;
}

export class ChecklistPayloadModel {
  originationId: number | undefined;
  documentIds: number[] | undefined;
  screenCode: number | undefined;
}
