import { Injectable } from "@angular/core";

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";
const JWT_USER = "jwt-user";
const IS_REMEMBER = "isRemember";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  private sessionStore = window.sessionStorage;
  private localStore = window.localStorage;
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
}
