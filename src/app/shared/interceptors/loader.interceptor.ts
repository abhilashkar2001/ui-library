import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
} from "@angular/common/http";

import { tap } from "rxjs/operators";
import { LoaderService } from "../services/loader.service";
import { ActivatedRoute, Router } from "@angular/router";
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(
    private _loaderService: LoaderService,
    private route: ActivatedRoute
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (
      !window.location.href.includes("landing") &&
      !request.url.includes("emi-calculation") &&
      !request.url.includes("/task-summary/requestStatus")
    )
      this._loaderService.ShowLoader();
    return next.handle(request).pipe(
      tap(
        (req) => {
          if (req instanceof HttpResponse) {
            this._loaderService.HideLoader();
          }
        },
        (err) => {
          this._loaderService.HideLoader();
        }
      )
    );
  }
}
