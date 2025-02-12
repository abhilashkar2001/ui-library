import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { TokenStorageService } from '@onerumango/utils';
import { SIGNIN } from '../models/signin.model';
import { SIGINDATA } from '../models/sigin-data.model';
import { GETGENERICVALUE } from '../models/generic-value.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  //WINDOW SESSION STORAGE
  session = window.sessionStorage;

  protected basePath = environment.microServiceURL;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenStorageService,
  ) {}

  signin(data: SIGINDATA, isRememberMe: boolean, otpRequired: boolean) {
    return this.httpClient
      .post(
        `${this.basePath}/auth/signin?rememberMe=${isRememberMe}&otpRequired=${otpRequired}`,
        data,
        { headers: { Anonymous: 'NOTKN' } },
      )
      .pipe(
        map((res: SIGNIN) => {
          if (res?.accessToken) {
            this.tokenService.setValidityInSecs(res?.validityInSecs);
            return this.tokenService.saveToken(res?.accessToken);
          }
        }),
      );
  }

  getCorporateProfile() {
    return this.httpClient.get<GETGENERICVALUE>(
      `${this.basePath}/loginApi/corpProfile`,
    );
  }
}
