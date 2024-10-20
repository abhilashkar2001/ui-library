import { Injectable } from "@angular/core";
import { SessionStorageEnum } from "app/enum/session-storage.enum";
import { ChecklistRouteObjModel } from "../models/checklist-model";
import { LoanAccounts } from "../models/loan-account.model";

export const RETURN_TO_SUMMARY = "returnToSummary";

@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  //WINDOW SESSION STORAGE
  private session = window.sessionStorage;

  constructor() {}

  /**
   * stringfy the item and stored
   * @param key
   * @param value
   */
  setItem(key: string, value: any) {
    this.session.removeItem(key);
    this.session.setItem(key, JSON.stringify(value));
  }

  /**
   * It will parsed the item and give you, that is stored in session storage
   * @param key of the item to be stored in session storage
   * @returns retun parsed object
   */
  getItem(key: string): any {
    const value = this.session.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  /**
   * This method will parse and give the origination id from session storage
   * @returns origination Id
   */
  getOriginationId() {
    const originationId = this.getItem(SessionStorageEnum.ORIGINATION_ID);
    return originationId;
  }

  /**
   * This method will stringfy and set the origination in session storage
   * @param originationId originationId to be set in session storage
   */
  setOriginationId(originationId: number) {
    this.session.removeItem(SessionStorageEnum.ORIGINATION_ID);
    this.setItem(SessionStorageEnum.ORIGINATION_ID, originationId);
  }

  /**
   * Parse and get the screen id for which checklist will be fetched
   */
  getScreenId() {
    return this.getItem(SessionStorageEnum.SCREEN_ID);
  }

  /**
   * This method will set screen Id in session storage
   * @param screenId
   */
  setScreenId(screenId: number | string) {
    this.session.removeItem(SessionStorageEnum.SCREEN_ID);
    this.setItem(SessionStorageEnum.SCREEN_ID, screenId);
  }

  getCustomerInfo() {
    return this.getItem(SessionStorageEnum.CUSTOMER_INFO);
  }

  setCustomerInfo(customerInfo) {
    this.session.removeItem(SessionStorageEnum.CUSTOMER_INFO);
    this.setItem(SessionStorageEnum.CUSTOMER_INFO, customerInfo);
  }

  /**
   * get parse obj of chekclist route obj from session storage
   * @returns
   */
  public getCheklistRouteObj() {
    const checklistRouteObj = this.getItem(
      SessionStorageEnum.CHECKLIST_ROUTE_OBJ
    );
    return checklistRouteObj;
  }

  /**
   * set checklist route obj in session storage
   * @param checklistRouteObj route obj
   */
  public setChecklistRouteObj(checklistRouteObj: ChecklistRouteObjModel) {
    this.removeChecklistRouteObj();
    this.setItem(SessionStorageEnum.CHECKLIST_ROUTE_OBJ, checklistRouteObj);
  }

  /**
   * Remove checklist route obj from session storage
   */
  public removeChecklistRouteObj() {
    this.session.removeItem(SessionStorageEnum.CHECKLIST_ROUTE_OBJ);
  }

  /**
   * Get Process Cycle Code from session storage
   * @returns
   */
  public getProcessCycleCode(): string {
    const processCycleCode: string = this.getItem(
      SessionStorageEnum.PROCESS_CYCLE_CODE
    );
    return processCycleCode;
  }

  /**
   * Save Process Cycle Code in session storage
   * @param processCycleCode
   */
  public setProcessCycleCode(processCycleCode: string): void {
    this.setItem(SessionStorageEnum.PROCESS_CYCLE_CODE, processCycleCode);
  }

  /**
   * fetch the list of card stored in session storeage
   * @returns
   */
  public getLoanInfo(): LoanAccounts {
    const loanInfo = this.getItem(SessionStorageEnum.LOAN_INFO);
    return loanInfo;
  }

  /**
   * set the loan info in session storage
   * @param loanInfo
   */
  public setLoanInfo(loanInfo): void {
    this.setItem(SessionStorageEnum.LOAN_INFO, loanInfo);
  }

  /**
   * fetch the list of card stored in session storeage
   * @returns
   */
  public getListOfCards(): any[] {
    const cardList = this.getItem(SessionStorageEnum.LIST_OF_CARDS);
    return cardList;
  }

  /**
   * set the list of card in session storage
   * @param listOfCards
   */
  public setListOfCards(listOfCards): void {
    this.setItem(SessionStorageEnum.LIST_OF_CARDS, listOfCards);
  }

  /**
   * this method will remove list of cards from session storage
   */
  public removeListOfCards(): void {
    this.session.removeItem(SessionStorageEnum.LIST_OF_CARDS);
  }

  /**
   * This method will get the list of account stored in session storage
   * @returns will parse the list of account array getting from session storage and return
   */
  public getListOfAccounts(): any[] {
    const listOfAccounts = this.getItem(SessionStorageEnum.LIST_OF_ACCOUNTS);
    return listOfAccounts;
  }

  /**
   * This method will stringfy and set the list of accounts in session storage
   * @param listOfAccounts
   */
  public setListOfAccounts(listOfAccounts: string[]): void {
    this.setItem(SessionStorageEnum.LIST_OF_ACCOUNTS, listOfAccounts);
  }

  /**
   * This mehtod will remove the list of account from the session storage
   */
  public removeListOfAccounts(): void {
    this.session.removeItem(SessionStorageEnum.LIST_OF_ACCOUNTS);
  }

  /**
   * FETCH: Selected account from session storage whose key is stored in SELECTED_ACCOUNT_NO in session storage enum
   * @returns it will give selected account no using enum
   */
  getSelectedAccountNo() {
    const accountNo = this.getItem(SessionStorageEnum.SELECTED_ACCOUNT_NO);
    return accountNo;
  }

  /**
   * This method will stringfy and set the selected account no in the session storage
   * @param selectedAccountNo
   */
  public setSelectedAccountNo(selectedAccountNo: string) {
    this.setItem(SessionStorageEnum.SELECTED_ACCOUNT_NO, selectedAccountNo);
  }

  /**
   * This method will remove the selected account no in session storage
   */
  public removeSelectedAccountNo() {
    this.session.removeItem(SessionStorageEnum.SELECTED_ACCOUNT_NO);
  }
}
