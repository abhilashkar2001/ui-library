import { Injectable } from "@angular/core";
import { LocalStoreService } from "../local-store.service";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { User } from "../../models/user.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class JwtAuthService {
  token;
  isAuthenticated: Boolean;
  user: User = {};
  user$ = new BehaviorSubject<User>(this.user);
  signingIn: Boolean;
  return: string;
  JWT_TOKEN = "JWT_TOKEN";
  APP_USER = "EGRET_USER";

  constructor(
    private ls: LocalStoreService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public signout() {
    this.setUserAndToken(null, null, false);
    this.router.navigateByUrl("sessions/signin");
  }

  getUser() {
    return this.ls.getItem(this.APP_USER);
  }

  setUserAndToken(token: String, user: User, isAuthenticated: Boolean) {
    this.isAuthenticated = isAuthenticated;
    this.token = token;
    this.user = user;
    this.user$.next(user);
    this.ls.setItem(this.JWT_TOKEN, token);
    this.ls.setItem(this.APP_USER, user);
  }
}
