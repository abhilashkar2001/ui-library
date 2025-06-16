import { Injectable } from '@angular/core';
import { SessionStorageEnum } from 'app/enum/session-storage.enum';
import { ChecklistRouteObjModel } from '../models/checklist-model';
import { LoanAccounts } from '../models/loan-account.model';
import {
  GETCUSTOMERINFO,
  GETLISTOFACCOUNTS,
} from '../models/session-storage.model';
import { environment } from 'environments/environment';
import * as CryptoJS from 'crypto-js';

export const RETURN_TO_SUMMARY = 'returnToSummary';
const SECRET_KEY = environment.SECRET_KEY;

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  //WINDOW SESSION STORAGE
  private session = window.sessionStorage;

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
    return bytes?.toString(CryptoJS.enc.Utf8);
  }

  /**
   * stringfy the item and stored
   * @param key
   * @param value
   */
  setItem(
    key: string,
    value:
      | string
      | number
      | ChecklistRouteObjModel
      | string[]
      | GETCUSTOMERINFO,
  ) {
    this.session.removeItem(key);
    this.session.setItem(key, this.encrypt(JSON.stringify(value)));
  }

  /**
   * It will parsed the item and give you, that is stored in session storage
   * @param key of the item to be stored in session storage
   * @returns retun parsed object
   */
  getItem(key: string) {
    const value = this.session.getItem(key);
    return value ? JSON.parse(this.decrypt(value)) : value;
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

  removeOriginationId() {
    this.session.removeItem(SessionStorageEnum.ORIGINATION_ID);
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
  setScreenId(screenId: any) {
    this.session.removeItem(SessionStorageEnum.SCREEN_ID);
    this.setItem(SessionStorageEnum.SCREEN_ID, screenId);
  }

  getCustomerInfo() {
    return this.getItem(SessionStorageEnum.CUSTOMER_INFO);
  }

  setCustomerInfo(customerInfo: GETCUSTOMERINFO) {
    this.session.removeItem(SessionStorageEnum.CUSTOMER_INFO);
    this.setItem(SessionStorageEnum.CUSTOMER_INFO, customerInfo);
  }

  /**
   * get parse obj of chekclist route obj from session storage
   * @returns
   */
  public getCheklistRouteObj() {
    const checklistRouteObj = this.getItem(
      SessionStorageEnum.CHECKLIST_ROUTE_OBJ,
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
      SessionStorageEnum.PROCESS_CYCLE_CODE,
    );
    return processCycleCode;
  }

  /**
   * Save Process Cycle Code in session storage
   * @param processCycleCode
   */
  public setProcessCycleCode(processCycleCode: any): void {
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
  public setLoanInfo(loanInfo: any): void {
    this.setItem(SessionStorageEnum.LOAN_INFO, loanInfo);
  }

  /**
   * this method will remove loan info from session storage
   */
  public removeLoanInfo(): void {
    this.session.removeItem(SessionStorageEnum.LOAN_INFO);
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
  public setListOfCards(listOfCards: any): void {
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
  public getListOfAccounts(): GETLISTOFACCOUNTS[] {
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

  /** FETCH: Current stage from session storage whose key is stored in CURRENT_STAGE in session storage enum
   * @returns
   */
  public getCurrentStage(): number {
    const currentStage = this.getItem(SessionStorageEnum.CURRENT_STAGE);
    return currentStage;
  }

  /**
   * This method will set the current stage id in the session storage
   * @param id
   */
  public setCurrentStage(id: number): void {
    this.setItem(SessionStorageEnum.CURRENT_STAGE, id);
  }

  /**
   * This method will remove the current stage no in session storage
   */
  public removeCurrentStage(): void {
    this.session.removeItem(SessionStorageEnum.CURRENT_STAGE);
  }

  /** FETCH: biometric id from session storage whose key is stored in BIOMETRIC_ID in session storage enum
   * @returns
   */
  public getBiometricId(): number {
    const biometricId = this.getItem(SessionStorageEnum.BIOMETRIC_ID);
    return biometricId;
  }

  /**
   * This method will set the biometric id in the session storage
   * @param id
   */

  public setBiometricId(id: number): void {
    this.setItem(SessionStorageEnum.BIOMETRIC_ID, id);
  }

  /**
   * This method will remove the biometric id in session storage
   */
  public removeBiometricId(): void {
    this.session.removeItem(SessionStorageEnum.BIOMETRIC_ID);
  }

  /**  FETCH: Account step from session storage whose key is stored in ACCOUNT_STEP in session storage enum
   * @returns
   */
  public getAccountStep(): any {
    const accountStep = this.getItem(SessionStorageEnum.ACCOUNT_STEP);
    return accountStep;
  }

  /**
   * This method will set the biometric id in the session storage
   * @param id
   */
  public setAccountStep(id: number): void {
    this.setItem(SessionStorageEnum.ACCOUNT_STEP, id);
  }

  /**
   * This method will remove the biometric id in session storage
   */
  public removeAccountStep(): void {
    this.session.removeItem(SessionStorageEnum.ACCOUNT_STEP);
  }

  /**  FETCH: Customer Id from session storage whose key is stored in CUSTOMER_ID in session storage enum
   * @returns
   */
  public getCustomerId(): any {
    const customerId = this.getItem(SessionStorageEnum.CUSTOMER_ID);
    return customerId;
  }

  /**
   * This method will set the customer id in the session storage
   * @param id
   */
  public setCustomerId(id: any): void {
    this.setItem(SessionStorageEnum.CUSTOMER_ID, id);
  }

  /**
   * This method will remove the customer id in session storage
   */
  public removeCustomerId(): void {
    this.session.removeItem(SessionStorageEnum.CUSTOMER_ID);
  }

  /**  FETCH: Mobile from session storage whose key is stored in MOBILE in session storage enum
   * @returns
   */
  public getMobile(): any {
    const mobile = this.getItem(SessionStorageEnum.MOBILE);
    return mobile;
  }

  /**
   * This method will set the Mobile in the session storage
   * @param id
   */
  public setMobile(id: any): void {
    this.setItem(SessionStorageEnum.MOBILE, id);
  }

  /**
   * This method will remove the mobile in session storage
   */
  public removeMobile(): void {
    this.session.removeItem(SessionStorageEnum.MOBILE);
  }

  /**  FETCH: Reference NUmber from session storage whose key is stored in REFERENCE_NUMBER in session storage enum
   * @returns
   */
  public getReferanceNumber(): any {
    const referenceNumber = this.getItem(SessionStorageEnum.REFERENCE_NUMBER);
    return referenceNumber;
  }

  /**
   * This method will set the reference number in the session storage
   * @param id
   */

  public setReferanceNumber(id: any): void {
    this.setItem(SessionStorageEnum.REFERENCE_NUMBER, id);
  }

  /**
   * This method will remove the reference number in session storage
   */
  public removeReferanceNumber(): void {
    this.session.removeItem(SessionStorageEnum.REFERENCE_NUMBER);
  }

  /**  FETCH: Type from session storage whose key is stored in TYPE in session storage enum
   * @returns
   */
  public getType(): any {
    const type = this.getItem(SessionStorageEnum.TYPE);
    return type;
  }

  /**
   * This method will set the TYPE id in the session storage
   * @param id
   */

  public setType(id: any): void {
    this.setItem(SessionStorageEnum.TYPE, id);
  }

  /**
   * This method will remove the type id in session storage
   */

  public removeType(): void {
    this.session.removeItem(SessionStorageEnum.TYPE);
  }

  /**  FETCH: Loan phone from session storage whose key is stored in LOAN_PHONE in session storage enum
   * @returns
   */
  public getLoanPhone(): any {
    const loanPhone = this.getItem(SessionStorageEnum.LOAN_PHONE);
    return loanPhone;
  }

  /**
   * This method will set the loan phone in the session storage
   * @param id
   */
  public setLoanPhone(id: string): void {
    this.setItem(SessionStorageEnum.LOAN_PHONE, id);
  }

  /**
   * This method will remove the biometric id in session storage
   */
  public removeLoanPhone(): void {
    this.session.removeItem(SessionStorageEnum.LOAN_PHONE);
  }

  /**
   *  FETCH: Loan basis details from session storage whose key is stored in LOAN_BASIS_DETAILS in session storage enum
   * @returns
   */
  public getLoanBasisDetails(): any {
    const loanBasisDetails = this.getItem(
      SessionStorageEnum.LOAN_BASIS_DETAILS,
    );
    return loanBasisDetails;
  }

  /**
   * `This method will set the loan basis details in the session storage
   * @param id
   */
  public setLoanBasisDetails(basisDetails: any): void {
    this.setItem(SessionStorageEnum.LOAN_BASIS_DETAILS, basisDetails);
  }

  /**
   * This method will remove the loan basis details in session storage
   */
  public removeLoanBasisDetails(): void {
    this.session.removeItem(SessionStorageEnum.LOAN_BASIS_DETAILS);
  }

  /**
   *  FETCH: Loan disburese id from session storage whose key is stored in LOAN_DISBURSE_ID in session storage enum
   * @returns
   */
  public getLoanDisburseId(): number {
    const loanDisburseId = this.getItem(SessionStorageEnum.LOAN_DISBURSE_ID);
    return loanDisburseId;
  }

  /**
   * This method will set the loan disburse id in the session storage
   * @param id
   */
  public setLoanDisburseId(id: string): void {
    this.setItem(SessionStorageEnum.LOAN_DISBURSE_ID, id);
  }

  /**
   * This method will remove the loan disburse id in session storage
   */

  public removeLoanDisburseId(): void {
    this.session.removeItem(SessionStorageEnum.LOAN_DISBURSE_ID);
  }

  /**  FETCH: Loan holder type from session storage whose key is stored in LOAN_HOLDER_TYPE in session storage enum
   * @returns
   */
  public getLoanHolderType(): any {
    const loanHolderType = this.getItem(SessionStorageEnum.LOAN_HOLDER_TYPE);
    return loanHolderType;
  }

  /**
   * This method will set the loan holder type in the session storage
   * @param id
   */
  public setLoanHolderType(id: string): void {
    this.setItem(SessionStorageEnum.LOAN_HOLDER_TYPE, id);
  }

  /**
   * This method will remove the loan holder type in session storage
   */
  public removeLoanHolderType(): void {
    this.session.removeItem(SessionStorageEnum.LOAN_HOLDER_TYPE);
  }

  /**  FETCH: Loan Amount from session storage whose key is stored in LOAN_AMOUNT in session storage enum
   * @returns
   */
  public getLoanAmount(): any {
    const loanAmount = this.getItem(SessionStorageEnum.LOAN_AMOUNT);
    return loanAmount;
  }

  /**
   * This method will set the loan amount in the session storage
   * @param id
   */
  public setLoanAmount(id: any): void {
    this.setItem(SessionStorageEnum.LOAN_AMOUNT, id);
  }

  /**
   * This method will remove the loan amount in session storage
   */
  public removeLoanAmount(): void {
    this.session.removeItem(SessionStorageEnum.LOAN_AMOUNT);
  }

  /**  FETCH: Ownership id from session storage whose key is stored in OWNERSHIP_ID in session storage enum
   * @returns
   */
  public getOwnershipId(): any {
    const ownerShipId = this.getItem(SessionStorageEnum.OWNERSHIP_ID);
    return ownerShipId;
  }

  /**
   * This method will set the ownership id in the session storage
   * @param id
   */
  public setOwnershipId(id: number): void {
    this.setItem(SessionStorageEnum.OWNERSHIP_ID, id);
  }

  /**
   * This method will remove the ownership id in session storage
   */
  public removeOwnershipId(): void {
    this.session.removeItem(SessionStorageEnum.OWNERSHIP_ID);
  }

  /**  FETCH: Loan step from session storage whose key is stored in LOAN_STEP in session storage enum
   * @returns
   */
  public getLoanStep(): any {
    const loanStep = this.getItem(SessionStorageEnum.LOAN_STEP);
    return loanStep;
  }

  /**
   * This method will set the loan step in the session storage
   * @param id
   */
  public setLoanStep(id: string): void {
    this.setItem(SessionStorageEnum.LOAN_STEP, id);
  }

  /**
   * This method will remove the loan step in session storage
   */
  public removeLoanStep(): void {
    this.session.removeItem(SessionStorageEnum.LOAN_STEP);
  }

  /**  FETCH: User customer id step from session storage whose key is stored in USER_CUSTOMER_ID in session storage enum
   * @returns
   */
  public getUserCustomerId(): any {
    const userCustomerId = this.getItem(SessionStorageEnum.USER_CUSTOMER_ID);
    return userCustomerId;
  }

  /**
   * This method will set the user customer id in the session storage
   * @param id
   */
  public setUserCustomerId(id: any): void {
    this.setItem(SessionStorageEnum.USER_CUSTOMER_ID, id);
  }

  /**
   * This method will remove the user customer id in session storage
   */
  public removeUserCustomerId(): void {
    this.session.removeItem(SessionStorageEnum.USER_CUSTOMER_ID);
  }

  /**  FETCH: Customer stage id from session storage whose key is stored in CUSTOMER_STAGE_ID in session storage enum
   * @returns
   */
  public getCustomerStageId(): any {
    const customerStageId = this.getItem(SessionStorageEnum.CUSTOMER_STAGE_ID);
    return customerStageId;
  }

  /**
   * This method will set the customer stage id in the session storage
   * @param id
   */
  public setCustomerStageId(id: string): void {
    this.setItem(SessionStorageEnum.CUSTOMER_STAGE_ID, id);
  }

  /**
   * This method will remove the customer stage id in session storage
   */
  public removeCustomerStageId(): void {
    this.session.removeItem(SessionStorageEnum.CUSTOMER_STAGE_ID);
  }

  /**  FETCH: Other doc screen code from session storage whose key is stored in OTHER_DOC_SCREEN_CODE in session storage enum
   * @returns
   */
  public getOtherDocScreenCode(): any {
    const otherDocScreenCode = this.getItem(
      SessionStorageEnum.OTHER_DOC_SCREEN_CODE,
    );
    return otherDocScreenCode;
  }

  /**
   * This method will set the other doc screen code id in the session storage
   * @param id
   */
  public setOtherDocScreenCode(id: string): void {
    this.setItem(SessionStorageEnum.OTHER_DOC_SCREEN_CODE, id);
  }

  /**
   * This method will remove the other doc screen code id in session storage
   */
  public removeOtherDocScreenCode(): void {
    this.session.removeItem(SessionStorageEnum.OTHER_DOC_SCREEN_CODE);
  }

  /**  FETCH: Auth user from session storage whose key is stored in AUTH_USER in session storage enum
   * @returns
   */
  public getAuthUser(): any {
    const authUser = this.getItem(SessionStorageEnum.AUTH_USER);
    return authUser;
  }

  /**
   * This method will set the auth user id in the session storage
   * @param id
   */
  public setAuthUser(id: string): void {
    this.setItem(SessionStorageEnum.AUTH_USER, id);
  }

  /**
   * This method will remove the auth user id in session storage
   */
  public removeAuthUser(): void {
    this.session.removeItem(SessionStorageEnum.AUTH_USER);
  }

  /**  FETCH: Get select acc no from session storage whose key is stored in SELECT_ACC_NO in session storage enum
   * @returns
   */
  public getSelectAccNo(): any {
    const selectAccNo = this.getItem(SessionStorageEnum.SELECT_ACC_NO);
    return selectAccNo;
  }

  /**
   * This method will set the get select acc no in the session storage
   * @param id
   */
  public setSelectAccNo(id: string): void {
    this.setItem(SessionStorageEnum.SELECT_ACC_NO, id);
  }

  /**
   * This method will remove the get select acc no in session storage
   */
  public removeSelectAccNo(): void {
    this.session.removeItem(SessionStorageEnum.SELECT_ACC_NO);
  }

  /**  FETCH: Upload types from session storage whose key is stored in UPLOAD_TYPES in session storage enum
   * @returns
   */
  public getUploadType(): any {
    const uploadTypes = this.getItem(SessionStorageEnum.UPLOAD_TYPES);
    return uploadTypes;
  }

  /**
   * This method will set the set upload type in the session storage
   * @param id
   */
  public setUploadType(id: string): void {
    this.setItem(SessionStorageEnum.UPLOAD_TYPES, id);
  }

  /**
   * This method will remove the upload type in session storage
   */
  public removeUploadType(): void {
    this.session.removeItem(SessionStorageEnum.UPLOAD_TYPES);
  }

  /**  FETCH: Corporate id from session storage whose key is stored in CORPORATE_ID in session storage enum
   * @returns
   */
  public getCorporateId(): any {
    const corporateID = this.getItem(SessionStorageEnum.CORPORATE_ID);
    return corporateID;
  }

  /**
   * This method will set the corporate id in the session storage
   * @param id
   */
  public setCorporateId(id: string): void {
    this.setItem(SessionStorageEnum.CORPORATE_ID, id);
  }

  /**
   * This method will remove the corporate id in session storage
   */
  public removeCorporateId(): void {
    this.session.removeItem(SessionStorageEnum.CORPORATE_ID);
  }

  /**  FETCH: Lc master id from session storage whose key is stored in LC_MASTER_ID in session storage enum
   * @returns
   */
  public getLcMasterId(): any {
    const lcMasterId = this.getItem(SessionStorageEnum.LC_MASTER_ID);
    return lcMasterId;
  }

  /**
   * This method will set the lc master id in the session storage
   * @param id
   */
  public setLcMasterId(id: string): void {
    this.setItem(SessionStorageEnum.LC_MASTER_ID, id);
  }

  /**
   * This method will remove the lc master id in session storage
   */
  public removeLcMasterId(): void {
    this.session.removeItem(SessionStorageEnum.LC_MASTER_ID);
  }

  /**  FETCH: Recurring deposit id from session storage whose key is stored in RECURRING_DEPOSIT_ID in session storage enum
   * @returns
   */
  public getRecurringDepositId(): any {
    const recurringDepositId = this.getItem(
      SessionStorageEnum.RECURRING_DEPOSIT_ID,
    );
    return recurringDepositId;
  }

  /**
   * This method will set the recurring deposite id in the session storage
   * @param id
   */
  public setRecurringDepositId(id: string): void {
    this.setItem(SessionStorageEnum.RECURRING_DEPOSIT_ID, id);
  }

  /**
   * This method will remove the recurring deposite id in session storage
   */
  public removeRecurringDepositId(): void {
    this.session.removeItem(SessionStorageEnum.RECURRING_DEPOSIT_ID);
  }

  /**  FETCH: Holder type from session storage whose key is stored in HOLDER_TYPE in session storage enum
   * @returns
   */
  public getHolderType(): any {
    const holderType = this.getItem(SessionStorageEnum.HOLDER_TYPE);
    return holderType;
  }

  /**
   * This method will set the holder type in the session storage
   * @param id
   */
  public setHolderType(id: string): void {
    this.setItem(SessionStorageEnum.HOLDER_TYPE, id);
  }

  /**
   * This method will remove the holder type id in session storage
   */
  public removeHolderType(): void {
    this.session.removeItem(SessionStorageEnum.HOLDER_TYPE);
  }

  /**  FETCH: Deposite origination id from session storage whose key is stored in deposite_origination_id in session storage enum
   * @returns
   */
  public getDepositOriginationId(): any {
    const depositeOriginationId = this.getItem(
      SessionStorageEnum.DEPOSITE_ORIGINATION_ID,
    );
    return depositeOriginationId;
  }

  /**
   * This method will set the Deposite origination id in the session storage
   * @param id
   */
  public setDepositOriginationId(id: string): void {
    this.setItem(SessionStorageEnum.DEPOSITE_ORIGINATION_ID, id);
  }

  /**
   * This method will remove the Deposite origination id in session storage
   */
  public removeDepositOriginationId(): void {
    this.session.removeItem(SessionStorageEnum.DEPOSITE_ORIGINATION_ID);
  }

  /**  FETCH: selected step from session storage whose key is stored in SELECTED_STEP in session storage enum
   * @returns
   */
  public getSelectedStep(): any {
    const selectedStep = this.getItem(SessionStorageEnum.SELECTED_STEP);
    return selectedStep;
  }

  /**
   * This method will set the selected step id in the session storage
   * @param id
   */

  public setSelectedStep(id: string): void {
    this.setItem(SessionStorageEnum.SELECTED_STEP, id);
  }

  /**
   * This method will remove the selected step id in session storage
   */
  public removeSelectedStep(): void {
    this.session.removeItem(SessionStorageEnum.SELECTED_STEP);
  }

  /**  FETCH: Payment type from session storage whose key is stored in PAYMENT_TYPE in session storage enum
   * @returns
   */
  public getPaymentType(): any {
    const PaymentType = this.getItem(SessionStorageEnum.PAYMENT_TYPE);
    return PaymentType;
  }

  /**
   * This method will set the Payment type id in the session storage
   * @param id
   */
  public setPaymentType(id: string): void {
    this.setItem(SessionStorageEnum.PAYMENT_TYPE, id);
  }

  /**
   * This method will remove the Payment type id in session storage
   */
  public removePaymentType(): void {
    this.session.removeItem(SessionStorageEnum.PAYMENT_TYPE);
  }

  /**  FETCH: Fixed deposit id from session storage whose key is stored in FIXED_DEPOSITE_ID in session storage enum
   * @returns
   */
  public getFixedDepositId(): any {
    const fixedDepositId = this.getItem(SessionStorageEnum.FIXED_DEPOSITE_ID);
    return fixedDepositId;
  }

  /**
   * This method will set the Fixed deposit id in the session storage
   * @param id
   */
  public setFixedDepositId(id: string): void {
    this.setItem(SessionStorageEnum.FIXED_DEPOSITE_ID, id);
  }

  /**
   * This method will remove the Fixed deposit id in session storage
   */
  public removeFixedDepositId(): void {
    this.session.removeItem(SessionStorageEnum.FIXED_DEPOSITE_ID);
  }

  /**  FETCH: Rd step from session storage whose key is stored in RD_STEP in session storage enum
   * @returns
   */
  public getRdStep(): any {
    const rdStep = this.getItem(SessionStorageEnum.RD_STEP);
    return rdStep;
  }

  /**
   *
   * @param id This method will set the Rd step in the session storage
   */
  public setRdStep(id: string): void {
    this.setItem(SessionStorageEnum.RD_STEP, id);
  }

  /**
   * This method will remove the Rd step id in session storage
   */
  public removeRdStep(): void {
    this.session.removeItem(SessionStorageEnum.RD_STEP);
  }

  /**  FETCH: User info from session storage whose key is stored in USER_INFO in session storage enum
   * @returns
   */
  public getUserInfo(): any {
    const userInfo = this.getItem(SessionStorageEnum.USER_INFO);
    return userInfo;
  }

  /**
   * This method will set the User info id in the session storage
   * @param id
   */
  public setUserInfo(id: string): void {
    this.setItem(SessionStorageEnum.USER_INFO, id);
  }

  /**
   * This method will remove the User info in session storage
   */
  public removeUserInfo(): void {
    this.session.removeItem(SessionStorageEnum.USER_INFO);
  }

  /**  FETCH: Customer data from session storage whose key is stored in CUSTOEMR_DATA in session storage enum
   * @returns
   */
  public getCustomerData(): any {
    const customerData = this.getItem(SessionStorageEnum.CUSTOMER_DATA);
    return customerData;
  }

  /**
   * This method will set the Customer data in the session storage
   * @param id
   */
  public setCustomerData(id: string): void {
    this.setItem(SessionStorageEnum.CUSTOMER_DATA, id);
  }

  /**
   * This method will remove the Customer data in session storage
   */
  public removeCustomerData(): void {
    this.session.removeItem(SessionStorageEnum.CUSTOMER_DATA);
  }

  /**  FETCH: Loan doc from session storage whose key is stored in LOAN_DOC in session storage enum
   * @returns
   */
  public getLoanDoc(): any {
    const loanDoc = this.getItem(SessionStorageEnum.LOAN_DOC);
    return loanDoc;
  }

  /**
   *
   * @param id This method will set the Loan doc in the session storage
   */
  public setLoanDoc(id: string): void {
    this.setItem(SessionStorageEnum.LOAN_DOC, id);
  }

  /**
   * This method will remove the Loan doc in session storage
   */
  public removeLoanDoc(): void {
    this.session.removeItem(SessionStorageEnum.LOAN_DOC);
  }

  /**  FETCH: From date from session storage whose key is stored in FROM_DATE in session storage enum
   * @returns
   */
  public getFromDate(): any {
    const fromDate = this.getItem(SessionStorageEnum.FROM_DATE);
    return fromDate;
  }

  /**
   * This method will set the from date in the session storage
   * @param id
   */
  public setFromDate(id: string): void {
    this.setItem(SessionStorageEnum.FROM_DATE, id);
  }

  /**
   * This method will remove the from date in session storage
   */
  public removeFromDate(): void {
    this.session.removeItem(SessionStorageEnum.FROM_DATE);
  }

  /**  FETCH: To date from session storage whose key is stored in TO_DATE in session storage enum
   * @returns
   */
  public getToDate(): any {
    const toDate = this.getItem(SessionStorageEnum.TO_DATE);
    return toDate;
  }

  /**
   * This method will set the To date in the session storage
   * @param id
   */
  public setToDate(id: string): void {
    this.setItem(SessionStorageEnum.TO_DATE, id);
  }

  /**
   * This method will remove the To date in session storage
   */
  public removeToDate(): void {
    this.session.removeItem(SessionStorageEnum.TO_DATE);
  }

  /**  FETCH: Corporate cust id from session storage whose key is stored in CORPORATE_CUST_ID in session storage enum
   * @returns
   */
  public getCorporateCustId(): any {
    const corporateCustId = this.getItem(SessionStorageEnum.CORPORATE_CUST_ID);
    return corporateCustId;
  }

  /**
   * This method will set the Corporate cust id in the session storage
   * @param id
   */
  public setCorporateCustId(id: string): void {
    this.setItem(SessionStorageEnum.CORPORATE_CUST_ID, id);
  }

  /**
   * This method will remove the Corporate cust id in session storage
   */
  public removeCorporateCustId(): void {
    this.session.removeItem(SessionStorageEnum.CORPORATE_CUST_ID);
  }

  /**  FETCH: Miscellaneouse id from session storage whose key is stored in MISCELLANEOUSE_ID in session storage enum
   * @returns
   */
  public getMiscellaneousId(): any {
    const miscellaneousId = this.getItem(SessionStorageEnum.MISCELLANEOUSE_ID);
    return miscellaneousId;
  }

  /**
   * This method will set the Miscellaneouse id in the session storage
   * @param id
   */
  public setMiscellaneousId(id: string): void {
    this.setItem(SessionStorageEnum.MISCELLANEOUSE_ID, id);
  }

  /**
   * This method will remove the Miscellaneouse id in session storage
   */
  public removeMiscellaneousId(): void {
    this.session.removeItem(SessionStorageEnum.MISCELLANEOUSE_ID);
  }

  /**  FETCH: Current screen code from session storage whose key is stored in CURRENT_SCREEN_CODE in session storage enum
   * @returns
   */
  public getCurrentScreenCode(): any {
    const currentScreenCode = this.getItem(
      SessionStorageEnum.CURRENT_SCREEN_CODE,
    );
    return currentScreenCode;
  }

  /**
   * This method will set the Current screen code in the session storage
   * @param id
   */
  public setCurrentScreenCode(id: string): void {
    this.setItem(SessionStorageEnum.CURRENT_SCREEN_CODE, id);
  }

  /**
   * This method will remove the Current screen code in session storage
   */
  public removeCurrentScreenCode(): void {
    this.session.removeItem(SessionStorageEnum.CURRENT_SCREEN_CODE);
  }

  /**  FETCH: Back data from session storage whose key is stored in BACK_DATA in session storage enum
   * @returns
   */
  public getBackData(): any {
    const backData = this.getItem(SessionStorageEnum.BACK_DATA);
    return backData;
  }

  /**
   * This method will set the Back data id in the session storage
   * @param id
   */
  public setBackData(id: any): void {
    this.setItem(SessionStorageEnum.BACK_DATA, id);
  }

  /**
   * This method will remove the Back data in session storage
   */
  public removeBackData(): void {
    this.session.removeItem(SessionStorageEnum.BACK_DATA);
  }

  /**  FETCH: Mobile No from session storage whose key is stored in MOBILE_NO in session storage enum
   * @returns
   */
  public getMobileNo(): any {
    const mobileNo = this.getItem(SessionStorageEnum.MOBILE_NO);
    return mobileNo;
  }

  /**
   * This method will set the Mobile No in the session storage
   * @param id
   */
  public setMobileNo(id: string): void {
    this.setItem(SessionStorageEnum.MOBILE_NO, id);
  }

  /**
   * This method will remove the Mobile No in session storage
   */
  public removeMobileNo(): void {
    this.session.removeItem(SessionStorageEnum.MOBILE_NO);
  }

  /**  FETCH:  tracking mobile from session storage whose key is stored in TRACKING_MOBILE in session storage enum
   * @returns
   */
  public getTrackingMobile(): any {
    const trackingMobile = this.getItem(SessionStorageEnum.TRACKING_MOBILE);
    return trackingMobile;
  }

  /**
   * This method will set the tracking mobile in the session storage
   * @param id
   */
  public setTrackingMobile(id: string): void {
    this.setItem(SessionStorageEnum.TRACKING_MOBILE, id);
  }

  /**
   * This method will remove the tracking mobile in session storage
   */
  public removeTrackingMobile(): void {
    this.session.removeItem(SessionStorageEnum.TRACKING_MOBILE);
  }

  /**  FETCH: User theme lang from session storage whose key is stored in USER_THEME_LANG in session storage enum
   * @returns
   */
  public getUserThemeLang(): any {
    const userThemeLang = this.getItem(SessionStorageEnum.USER_THEME_LANG);
    return userThemeLang;
  }

  /**
   * This method will set the User theme lang in the session storage
   * @param id
   */
  public setUserThemeLang(id: string): void {
    this.setItem(SessionStorageEnum.USER_THEME_LANG, id);
  }

  /**
   * This method will set the User theme lang in the session storage
   */
  public removeUserThemeLang(): void {
    this.session.removeItem(SessionStorageEnum.USER_THEME_LANG);
  }

  /**  FETCH: Doc appli name from session storage whose key is stored in DOC_APPLI_NAME in session storage enum
   * @returns
   */
  public getDocAppliName(): string | null {
    return this.getItem(SessionStorageEnum.DOC_APPLI_NAME);
  }

  public setDocAppliName(id: string): void {
    this.setItem(SessionStorageEnum.DOC_APPLI_NAME, id);
  }

  /**
   * This method will remove the Doc appli name in session storage
   */
  public removeDocAppliName(): void {
    this.session.removeItem(SessionStorageEnum.DOC_APPLI_NAME);
  }

  /**  FETCH: Fd step from session storage whose key is stored in FD_STEP in session storage enum
   * @returns
   */
  public getFdStep(): any {
    const fdStep = this.getItem(SessionStorageEnum.FD_STEP);
    return fdStep;
  }

  /**
   * This method will set the Fd step in the session storage
   * @param id
   */
  public setFdStep(id: string): void {
    this.setItem(SessionStorageEnum.FD_STEP, id);
  }

  /**
   * This method will remove the Fd step in session storage
   */
  public removeFdStep(): void {
    this.session.removeItem(SessionStorageEnum.FD_STEP);
  }

  /**  FETCH: Fd rd master id from session storage whose key is stored in FD_RD_MASTER_ID in session storage enum
   * @returns
   */
  public getFdRdMasterId(): any {
    const fdRdMaster = this.getItem(SessionStorageEnum.FD_RD_MASTER_ID);
    return fdRdMaster;
  }

  /**
   * This method will set the Fd rd master id in the session storage
   */
  public setFdRdMasterId(id: string): void {
    this.setItem(SessionStorageEnum.FD_RD_MASTER_ID, id);
  }

  /**
   * This method will remove the Fd rd master id in session storage
   */
  public removeFdRdMasterId(): void {
    this.session.removeItem(SessionStorageEnum.FD_RD_MASTER_ID);
  }

  /**  FETCH: Customer staging id from session storage whose key is stored in CUSTOMER_STAGING_ID in session storage enum
   * @returns
   */
  public getCustomerStagingId(): any {
    const custoermStagingId = this.getItem(
      SessionStorageEnum.CUSTOMER_STAGING_ID,
    );
    return custoermStagingId;
  }

  /**
   * This method will set the Customer staging id in the session storage
   * @param id
   */
  public setCustomerStagingId(id: string): void {
    this.setItem(SessionStorageEnum.CUSTOMER_STAGING_ID, id);
  }

  /**
   * This method will remove the Customer staging id in session storage
   */
  public removeCustomerStagingId(): void {
    this.session.removeItem(SessionStorageEnum.CUSTOMER_STAGING_ID);
  }

  /**  FETCH: Customer staging id from session storage whose key is stored in CUSTOMER_STAGING_ID in session storage enum
   * @returns
   */
  public getBasisDetails(): any {
    const basisDetails = this.getItem(SessionStorageEnum.BASIS_DETAILS);
    return basisDetails;
  }

  /**
   * This method will set the Customer staging id in the session storage
   * @param id
   */
  public setBasisDetails(id: string): void {
    this.setItem(SessionStorageEnum.BASIS_DETAILS, id);
  }

  /**
   * This method will remove the Customer staging id in session storage
   */
  public removeBasisDetails(): void {
    this.session.removeItem(SessionStorageEnum.BASIS_DETAILS);
  }

  public getCustomerName(): string[] {
    return this.getItem(SessionStorageEnum.CUSTOMER_NAME);
  }

  public setCustomerName(customerName: string): void {
    this.setItem(SessionStorageEnum.CUSTOMER_NAME, customerName);
  }

  public removeCustomerName(): void {
    this.session.removeItem(SessionStorageEnum.CUSTOMER_NAME);
  }

  public getCategory() {
    return this.getItem(SessionStorageEnum.CATEGORY);
  }

  public setCategory(category: string): void {
    this.setItem(SessionStorageEnum.CATEGORY, category);
  }

  public removeCategory(): void {
    this.session.removeItem(SessionStorageEnum.CATEGORY);
  }

  public getStageIdList(): number[] {
    return this.getItem(SessionStorageEnum.STAGE_ID_LIST);
  }

  public setStagingIdList(stagingIdList: number[]): void {
    this.setItem(
      SessionStorageEnum.STAGE_ID_LIST,
      JSON.stringify(stagingIdList),
    );
  }

  public removeStagingIdList() {
    this.session.removeItem(SessionStorageEnum.STAGE_ID_LIST);
  }

  public getReferenceNo() {
    return this.getItem(SessionStorageEnum.REF_NO);
  }

  public setReferenceNo(refNo: any) {
    return this.setItem(SessionStorageEnum.REF_NO, refNo);
  }

  public removeReferenceNo() {
    return this.session.removeItem(SessionStorageEnum.REF_NO);
  }

  public getPrimaryEmail() {
    return this.getItem(SessionStorageEnum.PRIMARY_EMAIL);
  }

  public setPrimaryEmail(primaryEmail: string) {
    return this.setItem(SessionStorageEnum.PRIMARY_EMAIL, primaryEmail);
  }

  public removePrimaryEmail() {
    this.session.removeItem(SessionStorageEnum.PRIMARY_EMAIL);
  }

  public getEmiData() {
    return this.getItem(SessionStorageEnum.EMI_DATA);
  }

  public setEmiData(emiData: string): void {
    this.setItem(SessionStorageEnum.EMI_DATA, emiData);
  }

  public removeEmiData(): void {
    this.session.removeItem(SessionStorageEnum.EMI_DATA);
  }
}
