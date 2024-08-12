export interface PendingApprovalSummary {
  id: number;
  bulkRefNo: any;
  fileName: string;
  productType?: string;
  processingDate: any;
  totalAmount: number;
  transactionReferenceNo: string;
  status: string;
  remarks: any;
  corpFundDetails: CorpFundDetail[];
  recordStatus: string;
  authStatus: string;
  action: string;
  oneTimeAuth: string;
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  empId: any;
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
  beneficiaryName: any;
  transferMode: string;
  transferType: string;
  ifscCode: string;
  icustRefNo: string;
  cbsRefNo: any;
  status: any;
  updatedBy: any;
  updatedDate: any;
  addressLine1?: string;
  addressLine2?: string;
  customerName: string;
  pinCode?: string;
  countryName?: string;
  bulkRefNo: any;
  fileName: any;
  uploadstatus: string;
  corpCustId: any;
}
