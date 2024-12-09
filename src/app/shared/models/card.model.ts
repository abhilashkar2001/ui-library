export interface CardModel {
  cardName: string;
  expiryDate: string;
  fileUrl: string;
  cashLimit: string;
  totalCreditLimit: string;
  statementDate: string;
  lastPaymentDate: string;
  totalDueAmount: string;
  accountCurrency: string;
  rewardPoint: number;
  dueDate: string | number;
  cardStatus: string;
  id: number;
  bankName: string;
  cardNumber: any;
  customerName: string;
  validDate: string;
  typeOfCard: string;
  autoPay: boolean;
  currentOutStaning: number;
  avlCreditBalance: number;
  lastStlmtMade: number;
  accountNumber: string;
  customerId: number;
  status: string;
  cvv: number;
  cardType?: string;
  joiningFee?: number;
  annualFee?: number;
  benefits?: string[];
}

export declare type Cards = CardModel[];

export interface CardTransactionModel {
  date: string;
  refNumber: string;
  details: string;
  amount: number | string;
  points: number;
  transactionDate: string;
}
export interface HeaderModel {
  key: string;
  label: string;
  actionItem?: (action?: any) => string;
  actionKey?: string;
}
export interface AccountList {
  accountNo?: string;
  accountBranch?: string;
  accountCurrency?: string;
  accountBalance: any;
  id?: number;
  cardName?: string;
  cardType?: string;
  bankName?: string;
  cardNumber: any;
  customerName?: string;
  validDate?: string;
  typeOfCard?: string;
  autoPay?: boolean;
  cardStatus?: boolean;
  rewardPoint?: number;
  totalDueAmount?: number;
  minDueAmount?: number;
  dueDate?: string;
  currentOutStaning?: number;
  avlCreditBalance?: number;
  totalCreditLimit?: number;
  statementDate?: string;
  lastStlmtMade?: number;
  lastPaymentDate?: string;
  accountNumber?: string;
  customerId?: number;
  currencyCode: string;
}

export interface Payee {
  benificiaryId: any;
  benificiaryMasterId: number;
  isFavorite: any;
  accountNo?: string;
  payeeName: string;
  nickName?: string;
  bankType: any;
  mobileNumber?: string;
  emailId?: string;
  bankName: any;
  bankCode: any;
  branchName: any;
  branchCode: any;
  mobileCode?: string;
  profilePicUrl: any;
  customerId?: number;
  payeeFrom?: string;
  swiftCode?: string;
  purpose: any;
  confirmAccountNumber: any;
  account: any;
  visibility: any;
  beneficiaryStatus: any;
  countryCode: any;
  recordStatus: any;
  authStatus: any;
  action: any;
  oneTimeAuth: any;
  created: any;
  createdBy: any;
  lastUpdated: any;
  lastUpdatedBy: any;
  empId: any;
  version: any;
  countryName?: string;
  refNumber: any;
  source?: string;
  icustRefNo: string;
}
