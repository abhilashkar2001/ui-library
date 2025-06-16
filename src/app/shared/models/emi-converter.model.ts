export interface CardDetails {
  amount?: number;
  noOfElements?: number;
  cardName?: string;
  cardNumber?: string;
  cardId?: string;
  maturityDate?: string;
  nameOnCard?: string;
}

export interface TransactionDetail {
  nameOnCard: string;
  transactionDate: string;
  details: string;
  amount: number;
  refNo: string;
  convertToEmi: boolean;
  cardName: string;
  cardNumber: string;
  cardId: string;
  maturityDate: string;
}

export interface cardTransactionDetails {
  retailFundTransferMasterId: number;
  icustRefNo: string;
  retailFundTransferId: number;
  debitAccount: string;
  debitCurrency: string;
  debitBranch: string;
  debitAmount: number;
  creditAccount: string;
  creditCurrency: string;
  creditBranch: string;
  creditAmount: number;
  transferMode: string;
  transferType: string;
  ifscCode: string;
  cbsRefNo: string;
  status: string;
  customerId: string;
  paymentType: string;
  totalOutStanding: number;
  transactionStatus: string;
  recordStatus: string;
  authStatus: string;
  action: string;
  oneTimeAuth: string;
  created: string;
  createdBy: string;
  lastUpdated: string;
  lastUpdatedBy: string;
  empId: string;
  version: string;
  cardFundTransfer: CardFundTransfer;
}

export interface CardFundTransfer {
  id: number;
  totalDue: number;
  minimumDue: number;
  other: string;
  autopay: boolean;
  selectAmount: string;
  maxAutopayAmount: string;
  cardDetailsId: number;
  cardDetails: CardDetails;
}

export interface CardDetails {
  id: number;
  cardType: string;
  bankName: string;
  customerName: string;
  validDate: string;
  typeOfCard: string;
  autoPay: boolean;
  cardStatus: boolean;
  rewardPoint: number;
  totalDueAmount: number;
  minDueAmount: number;
  dueDate: string;
  requestedDate: string;
  currentOutStaning: number;
  avlCreditBalance: number;
  totalCreditLimit: number;
  statementDate: string;
  lastStlmtMade: number;
  lastPaymentDate: string;
  accountNumber: string;
  customerId: number;
  status: string;
  refNo: string;
  reissueCard: string;
  branchNearBy: string;
  reason: string;
  addressType: string;
  addressInfo: string;
  branchCode: string;
  document: Document;
}

export interface Document {
  documentId: number;
  documentName: string;
  documentType: string;
  fileName: string;
  fileType: string;
  documentSide: number;
  verificationType: string;
  fileUrl: string;
  idNumber: string;
  passportNumber: string;
  issueDate: string;
  expiryDate: string;
  dob: string;
}

export interface EmiDetails {
  merchantNameOnCard: string;
  amount: number;
  tenure: string;
  monthlyEmi: number;
  interestRate: number;
  currentOutStaning: number;
  status: string;
  startDate: string;
  endDate: string;
  pendingEmi: number;
}
