import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { TokenStorageService } from "../token-storage.service";

@Injectable()
export class NetBankUserGaurd implements CanActivate {
  constructor(private tokenStore: TokenStorageService, private route: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.tokenStore.isNetBankingUser()) return true;
    else {
      this.route.navigate(["/sessions/signin"]);
      return false;
    }
  }
}
