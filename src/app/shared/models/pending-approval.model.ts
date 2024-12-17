export interface PendingApprovalSummary {
  id: number;
  bulkRefNo: number;
  fileName: string;
  productType?: string;
  processingDate: Date;
  totalAmount: number;
  transactionReferenceNo: string;
  status: string;
  remarks: string;
  corpFundDetails: CorpFundDetail[];
  recordStatus: string;
  authStatus: string;
  action: string;
  oneTimeAuth: string;
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  empId: number;
  version: number;
}

export interface CorpFundDetail {
  id: number;
  debitAccount: string;
  debitCurrency: any;
  debitBranch: any;
  debitAmount: number;
  creditAccount: string;
  creditCurrency: any;
  creditBranch: any;
  creditAmount: number;
  beneficiaryName: string;
  transferMode: string;
  transferType: string;
  ifscCode: string;
  icustRefNo: string;
  cbsRefNo: number;
  status: any;
  updatedBy: any;
  updatedDate: Date;
  addressLine1?: string;
  addressLine2?: string;
  customerName: string;
  pinCode?: string;
  countryName?: string;
  bulkRefNo: number;
  fileName: string;
  uploadstatus: string;
  corpCustId: number;
}
