import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { JwtAuthService } from "../services/auth/jwt-auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  isLoggedIn: boolean = true;
  constructor(private router: Router, private jwtAuth: JwtAuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(["/account"], {
        queryParams: {
          return: state.url,
        },
      });
      return false;
    }
  }
}
