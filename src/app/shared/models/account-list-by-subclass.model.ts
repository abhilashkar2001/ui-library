import { IcHttpResponseModel } from "./ic-http-response.model";

export interface AccountListBySubclassModel extends IcHttpResponseModel {
  data: AccountListBySubclass;
}

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
