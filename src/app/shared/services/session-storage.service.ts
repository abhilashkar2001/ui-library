import { Injectable } from "@angular/core";
import { SessionStorageEnum } from "app/enum/session-storage.enum";

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
  setScreenId(screenId: number) {
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
}
