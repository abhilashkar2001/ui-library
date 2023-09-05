import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtAuthService } from "../services/auth/jwt-auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private jwtAuth: JwtAuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    var token = this.jwtAuth.token || "asasaasasasasasa";

    var changedReq;

    if (token) {
      changedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzYWt0aGkiLCJpYXQiOjE2ODU5NDY1NDQsImV4cCI6MjA4NTk0NjU0NH0.QpghhNDwyVVJjQ6M_C_K80CFE3JSFT4t6Zw9HigOkCNj-LTFEVMgLoETwzsHBJUU`,
        },
      });
    } else {
      changedReq = req;
    }
    return next.handle(changedReq);
  }
}
