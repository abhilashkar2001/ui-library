import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { map } from "rxjs/operators";
import { TokenStorageService } from "./token-storage.service";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  protected basePath = environment.microServiceURL;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenStorageService
  ) {}

  signin(data: any, isRememberMe: boolean, otpRequired: boolean) {
    return this.httpClient
      .post<any>(
        `${this.basePath}/auth/signin?rememberMe=${isRememberMe}&otpRequired=${otpRequired}`,
        data,
        { headers: { Anonymous: "NOTKN" } }
      )
      .pipe(
        map((res) => {
          if (res?.accessToken) {
            return this.tokenService.saveToken(res?.accessToken);
          }
        })
      );
  }

  getProfileInfo() {
    return this.httpClient.get<any>(`${this.basePath}/loginApi/profile`);
  }
}
