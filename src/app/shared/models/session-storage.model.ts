export type Root = GETLISTOFACCOUNTS[];

export interface GETLISTOFACCOUNTS {
  accountNo: string;
  accountBranch: string;
  accountCurrency: string;
  accountBalance: number;
  accountType?: string;
}

export interface GETCUSTOMERINFO {
  customerId: number;
  customerNo: number;
  customerName: string;
  mobileNumber: string;
  accounts: Account[];
  loanDetails: LoanDetail[];
}

export interface Account {
  accountType: string;
  type: string;
  accountList: AccountList[];
}

export interface AccountList {
  accountNo: string;
  accountBranch: string;
  accountCurrency: string;
  accountBalance: number;
}

export interface LoanDetail {
  accountType: string;
  type: string;
  accountList: AccountList2[];
}

export interface AccountList2 {
  accountNo: string;
  accountBranch: string;
  accountCurrency: string;
  accountBalance: number;
}
