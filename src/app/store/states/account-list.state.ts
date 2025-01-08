import { ListOfAccounts } from '../models';

export interface ListOfAccountState {
  accountList: ListOfAccounts;
}

export const listOfAccountIntialState = {
  accountList: [],
};
