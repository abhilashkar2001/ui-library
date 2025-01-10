import { Injectable } from '@angular/core';
import { StaticData } from './models/static.constant';
import { Time } from 'highcharts';
import { COUNTRYCURRENCY } from './models/country-currency.mode';
import { CurrencyList } from './models/currency.models';
import { Data } from '@angular/router';
import { environment } from 'environments/environment';
import * as CryptoJS from 'crypto-js';
import { Store } from '@ngrx/store';
import { selectUser } from './store/selector/user-profileInfo.selector';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const JWT_USER = 'jwt-user';
const IS_REMEMBER = 'isRemember';
const USER_INFO = 'userInfo';
const CORPORATE_ID = 'corporateId';

const SECRET_KEY = environment.SECRET_KEY;
export const VALIDITY_IN_SECS = 'validityInSecs';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor(private store: Store) {}

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private sessionStore = window.sessionStorage;
  private localStore = window.localStorage;
  currencyList: CurrencyList = StaticData.currencyList;
  aliveProperties: string[] = [
    'userInfo',
    'auth-user',
    'auth-token',
    'validityInSecs',
  ];

  signOut() {
    this.localStore.removeItem(USER_KEY);
    this.localStore.removeItem(TOKEN_KEY);
    this.sessionStore.clear();
    this.localStore.removeItem(IS_REMEMBER);
  }

  public saveToken(token: string) {
    // Encrypt the token before saving it
    const encryptedToken = this.encrypt(token);
    this.sessionStore.removeItem(TOKEN_KEY);
    this.sessionStore.setItem(TOKEN_KEY, encryptedToken);
  }

  public getToken() {
    const token = this.sessionStore.getItem(TOKEN_KEY);
    return token ? this.decrypt(token) : null;
  }

  // Retrieve and decrypt user data
  public getUser() {
    const encryptedUser = this.sessionStore.getItem(USER_KEY);
    return encryptedUser ? JSON.parse(this.decrypt(encryptedUser)) : null;
  }

  saveLastLoginSession(time: Time) {
    this.sessionStore.setItem('LAST_LOGIN', JSON.stringify(time));
  }

  getLastLoginSession() {
    const parseTime: Date | string | null =
      this.sessionStore.getItem('LAST_LOGIN');
    if (parseTime) return JSON.parse(parseTime);
  }

  saveLanguage(language: string) {
    this.sessionStore.setItem('LANGUAGE', JSON.stringify(language));
  }

  getLanguage() {
    const parseLanguage: string | null = this.sessionStore.getItem('LANGUAGE');
    if (parseLanguage) return JSON.parse(parseLanguage);
  }

  public isLoggedIn(): boolean {
    return !!this.getAuthStatus();
  }

  private getAuthStatus() {
    return (
      this.sessionStore.getItem(TOKEN_KEY) !== null &&
      this.store.select(selectUser)
    );
  }

  getJwtUser() {
    return JSON.parse(<string>this.sessionStore.getItem(JWT_USER));
  }
  getLogedCountry() {
    const userInfo = this.sessionStore.getItem('userInfo');
    if (userInfo) {
      return JSON.parse(userInfo);
    } else {
      return null;
    }
  }
  setValidityInSecs(validityInSecs: any) {
    this.sessionStore.removeItem(VALIDITY_IN_SECS);
    this.sessionStore.setItem(VALIDITY_IN_SECS, validityInSecs);
  }

  getValidityInSecs() {
    return this.sessionStore.getItem(VALIDITY_IN_SECS);
  }

  getCorporateId() {
    return JSON.parse(<string>this.sessionStore.getItem(CORPORATE_ID));
  }
  setCorporateId(corporateId: number) {
    this.sessionStore.removeItem(CORPORATE_ID);
    this.sessionStore.setItem(CORPORATE_ID, JSON.stringify(corporateId));
  }

  getRememberMe() {
    return JSON.parse(<string>this.sessionStore.getItem(IS_REMEMBER));
  }

  saveUserOtherInfo(info: COUNTRYCURRENCY | Data) {
    this.sessionStore.setItem(
      USER_INFO,
      JSON.stringify({
        ...info,
        currencySymbol: this.currencyList[info.currency]?.symbol,
      }),
    );
  }
  getUserOtherInfo() {
    return JSON.parse(<string>this.sessionStore.getItem(USER_INFO));
  }

  cleanUpSessionPartially() {
    const keys = Object.keys(sessionStorage);
    const propertiesToKeep = this.aliveProperties;
    // Iterate through keys and delete the ones not in propertiesToKeep
    keys.forEach(function (key) {
      if (!propertiesToKeep.includes(key)) {
        sessionStorage.removeItem(key);
      }
    });
  }
}