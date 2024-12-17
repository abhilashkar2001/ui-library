export type LoanAccounts = LoanAccount[];

export interface LoanAccount {
  originationId: number;
  businessProductName: string;
  productDescription: string;
  originationAccNo: number;
  applicationDate: string;
  userReferenceNo: string;
  cbsReferenceNo: string;
  icustRefNo: string;
  numOfApplicants: number;
  ownership: number;
  ownershipValue: string;
  source: string;
  accountType: string;
  accountDescription: string;
  status: string;
  subStatus: string;
  signatureInfoId: number;
  branchId: number;
  branchCode: string;
  branchName: string;
  bankName: string;
  bankCode: string;
  swiftCode: string;
  currencyCode: string;
  rmUserId: number;
  rmUserName: string;
  agentUserId: number;
  agentUserName: string;
  agentId: number;
  nextInstallmentAmount: number;
  nextInstallmentDate: string;
  outstandingAmount: number;
  maturityDate: string;
  currentInterestRate: number;
  checklistDocumentInfo: any;
  cbsAccountNumber: string;
  loanAccountStatus: string;
}

export interface Account {
  accountNo: string | null;
  accountBranch: string;
  accountCurrency: string;
  accountBalance: number | null;
  accountType?: string;
}

export interface LoanAccount {
  accountType: string;
  type: string;
  accountList: Account[];
}

export interface LoanDetails {
  customerId: string | null;
  customerNo: string | null;
  customerName: string | null;
  mobileNumber: string | null;
  accounts: LoanAccount[];
}
