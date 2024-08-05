export interface AccountListBySubclass {
  [key: string]: Account[];
}

export interface Account {
  accountNo: string;
  customerName: string;
  currencyCode: string;
  branchName: string;
  accountBalance: any;
}
