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
  actionItem?: (action?) => string;
  actionKey?: string;
}
