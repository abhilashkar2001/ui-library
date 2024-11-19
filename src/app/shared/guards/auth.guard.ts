import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { TokenStorageService } from "../token-storage.service";

@Injectable()
export class AuthGuard  {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.tokenService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(["/home/401"]);
      return false;
    }
  }
}
