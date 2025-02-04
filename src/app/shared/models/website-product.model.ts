export interface WEBSITEPRODUCT {
  statusCode: number;
  status: string;
  data: Daum[];
  message: string;
}

export interface Daum {
  id: number;
  businessSuiteId: number;
  basisClass: string;
  bankId: number;
  description: string;
  businessSuite: string;
  documentId: number;
  documents: Documents;
  entityCode: string;
  bankCode: string;
  recordStatus: string;
  authStatus: string;
  oneTimeAuth: string;
  created: string;
  createdBy: string;
  authBy?: string;
  authorizedDate?: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  empId?: number;
  version: number;
  action: string;
}

export interface Documents {
  documentId: number;
  documentName?: number;
  documentType?: string;
  fileName: string;
  fileType: string;
  documentSide?: string;
  verificationType?: string;
  fileUrl: File | string;
  documentNumber?: number;
  issueDate?: Date | string;
  expiryDate?: Date | string;
  dob?: string | Date;
}

export interface BasisSubClassModel {
  action: string;
  authBy: any;
  authorizedDate: any;
  authStatus: string;
  bankCode: string;
  bankId: number;
  basisClass: string;
  basisClassId: number;
  businessSuite: string;
  businessSuiteId: number;
  created: string;
  createdBy: string;
  description: string;
  documentId: number;
  documentInfo: DocumentInfo;
  empId: string;
  entityCode: string;
  id: number;
  lastUpdated: string;
  lastUpdatedBy: string;
  oneTimeAuth: string;
  recordStatus: string;
  subClassName: string;
  version: any;
}

export interface DocumentInfo {
  dob: any;
  documentId: number;
  documentName: any;
  documentNameValue: any;
  documentNumber: any;
  documentSide: any;
  documentType: any;
  expiryDate: any;
  fileData: any;
  fileName: string;
  fileType: string;
  fileUrl: string;
  issueDate: any;
  passportNumber: any;
  verificationType: any;
}
