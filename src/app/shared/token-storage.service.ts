import { Injectable } from "@angular/core";
import { StaticData } from "./models/static.constant";

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";
const JWT_USER = "jwt-user";
const IS_REMEMBER = "isRemember";
const USER_INFO = "userInfo";
const CORPORATE_ID = "corporateId";

export const VALIDITY_IN_SECS = "validityInSecs";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  private sessionStore = window.sessionStorage;
  private localStore = window.localStorage;
  currencyList = StaticData.currencyList;
  aliveProperties: string[] = [
    "userInfo",
    "auth-user",
    "auth-token",
    "validityInSecs",
  ];
  constructor() {}

  signOut() {
    this.localStore.removeItem(USER_KEY);
    this.localStore.removeItem(TOKEN_KEY);
    this.sessionStore.clear();
    this.localStore.removeItem(IS_REMEMBER);
  }

  public saveToken(token: string) {
    this.sessionStore.removeItem(TOKEN_KEY);
    this.sessionStore.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return this.sessionStore.getItem(TOKEN_KEY);
  }

  public saveUser(user) {
    this.sessionStore.removeItem(USER_KEY);
    this.sessionStore.setItem(USER_KEY, JSON.stringify(user));
  }

  saveLastLoginSession(time) {
    this.sessionStore.setItem("LAST_LOGIN", JSON.stringify(time));
  }

  getLastLoginSession() {
    let parseTime = this.sessionStore.getItem("LAST_LOGIN");
    return JSON.parse(parseTime);
  }

  saveLanguage(language) {
    this.sessionStore.setItem("LANGUAGE", JSON.stringify(language));
  }

  getLanguage() {
    let parseLanguage = this.sessionStore.getItem("LANGUAGE");
    return JSON.parse(parseLanguage);
  }

  public getUser() {
    return JSON.parse(this.sessionStore.getItem(USER_KEY));
  }

  public isLoggedIn(): boolean {
    return !!this.getAuthStatus();
  }

  private getAuthStatus() {
    return (
      this.sessionStore.getItem(TOKEN_KEY) !== null &&
      this.sessionStore.getItem(USER_KEY) !== null
    );
  }

  public saveJwtUser(user) {
    this.sessionStore.removeItem(JWT_USER);
    this.sessionStore.setItem(JWT_USER, JSON.stringify(user));
  }

  getJwtUser() {
    return JSON.parse(this.sessionStore.getItem(JWT_USER));
  }
  getLogedCountry() {
    let userInfo = this.sessionStore.getItem("userInfo");
    if (userInfo) {
      return JSON.parse(userInfo);
    } else {
      return null;
    }
  }
  setValidityInSecs(validityInSecs) {
    this.sessionStore.removeItem(VALIDITY_IN_SECS);
    this.sessionStore.setItem(VALIDITY_IN_SECS, validityInSecs);
  }

  getValidityInSecs() {
    return this.sessionStore.getItem(VALIDITY_IN_SECS);
  }

  setRememberMe(rememberMe) {
    this.sessionStore.removeItem(IS_REMEMBER);
    this.sessionStore.setItem(IS_REMEMBER, rememberMe);
  }

  getCorporateId() {
    return JSON.parse(this.sessionStore.getItem(CORPORATE_ID));
  }
  setCorporateId(corporateId) {
    this.sessionStore.removeItem(CORPORATE_ID);
    this.sessionStore.setItem(CORPORATE_ID, corporateId);
  }

  getRememberMe() {
    return JSON.parse(this.sessionStore.getItem(IS_REMEMBER));
  }

  saveUserOtherInfo(info) {
    this.sessionStore.setItem(
      USER_INFO,
      JSON.stringify({
        ...info,
        currencySymbol: this.currencyList[info.currency].symbol,
      })
    );
  }
  getUserOtherInfo() {
    return JSON.parse(this.sessionStore.getItem(USER_INFO));
  }

  cleanUpSessionPartially() {
    var keys = Object.keys(sessionStorage);
    var propertiesToKeep = this.aliveProperties;
    // Iterate through keys and delete the ones not in propertiesToKeep
    keys.forEach(function (key) {
      if (!propertiesToKeep.includes(key)) {
        sessionStorage.removeItem(key);
      }
    });
  }
}
