export type LoanAccounts = LoanAccount[];

export interface LoanAccount {
    originationId: number;
    businessProductName: string;
    productDescription: string;
    originationAccNo: any;
    applicationDate: string;
    userReferenceNo: string;
    cbsReferenceNo: string;
    icustRefNo: string;
    numOfApplicants: number;
    ownership: any;
    ownershipValue: any;
    source: string;
    accountType: string;
    accountDescription: string;
    status: string;
    subStatus: any;
    signatureInfoId: any;
    branchId: number;
    branchCode: string;
    branchName: string;
    bankName: string;
    bankCode: string;
    swiftCode: any;
    currencyCode: any;
    rmUserId: any;
    rmUserName: any;
    agentUserId: any;
    agentUserName: any;
    agentId: any;
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
