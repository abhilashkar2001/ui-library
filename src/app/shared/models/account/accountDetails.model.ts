export interface CustomerAccount {
  id: number;
  accountDescription: string;
  accountBranch: string;
  businessProductName: string;
  productDescription: string;
  accountType: string;
  customerInfo: any | null;
  accountCurrency: any | null;
  applicationDate: string;
  userRefNumber: string;
  cbsRefNumber: string;
  swiftCode: string;
  agentCode: string;
  rmId: string;
  initialFunding: boolean;
  overdraftRequested: boolean;
  jointCustomerInfo: any | null;
  customerAccountInitialFunding: CustomerAccountInitialFunding;
  originationDetail: OriginationDetail;
  customerMandateInfo: any | null;
  customerAccountNomineeDetailsList: any | null;
  customerAccountServiceInfo: any | null;
  customerAccountOverdraftInfo: any | null;
  customerAccountInterestInfo: any | null;
  customerAccountChargeInfo: any | null;
  customerAccountQualitativeScoreInfo: any | null;
  customerAccountQuantativeScoreInfo: any | null;
  customerAccountDigitalSignatureInfo: any | null;
}

export interface CustomerAccountInitialFunding {
  id: number;
  accountFundBy: string | null;
  amount: number;
  fundByAccount: string;
  branchCode: string;
  chequeNumber: string | null;
  tellertransactionRefNo: string;
}

export interface OriginationDetail {
  originationId: number;
  applicationDate: string;
  icustRefNo: string;
  source: string;
  status: string;
  subStatus: string;
  branch: Branch;
  accountCurrency: AccountCurrency;
  productDetails: ProductDetails;
}

export interface Branch {
  id: number;
  branchCode: string | null;
  branchName: string | null;
  externalSystemBrnCode: string | null;
  language: string | null;
  swiftCode: string | null;
  walkInCustomer: string | null;
  centralbankAccount: string | null;
  currencyChestAccount: string | null;
  clearingBranch: string | null;
  branchOffsetTiming: string | null;
  clearingCutOfTime: string | null;
  lattitude: string | null;
  longitude: string | null;
}

export interface AccountCurrency {
  id: number;
  currencyCode: string;
  currencyName: string | null;
  isoCcyCode: string | null;
  altCcyCode: string | null;
  ccyDecimals: number | null;
  ccySpotDays: number | null;
  currencyType: string | null;
  clearingCutOffTimingHours: string | null;
  clearingCutOffTimingMins: string | null;
  euro: boolean;
}

export interface ProductDetails {
  id: number;
  basisCode: string | null;
  basisName: string | null;
  basisDetailStory: string | null;
  internal: boolean;
  website: boolean;
  cbsOutput: string | null;
  effectiveDate: string | null;
  expiryDate: string | null;
  reviewFrequency: string | null;
  autoApproval: boolean;
  individual: boolean;
}
