/* eslint-disable prettier/prettier */
import { createAction, props } from '@ngrx/store';
import { ListOfAccounts } from '../models';

export const setAccountList = createAction(
  '[Account List]',
  props<{ accountList: ListOfAccounts }>(),
);
