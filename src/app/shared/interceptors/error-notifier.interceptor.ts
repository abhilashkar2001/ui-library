import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { of, throwError } from "rxjs";
import Swal from "sweetalert2";

@Injectable()
export class ErrorNotifierService implements HttpInterceptor {
  constructor() {}
  errorData: { code: any; message: string }[] = [
    { code: 400, message: "Bad Request" },
    { code: 401, message: "Unauthorized" },
    { code: 403, message: "Forbidden" },
    { code: 404, message: "Not Found" },
    { code: 500, message: "Internal Server Error" },
    { code: 502, message: "Bad Gateway" },
    { code: 503, message: "Service Unavailable" },
    { code: 504, message: "Gateway Timeout" },
    { code: 0, message: "Error" },
  ];
  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let handled: boolean = false;
        let history: any = [];
        return next.handle(request).pipe(
          catchError((err) => {
            if (err instanceof HttpErrorResponse) {
              let errorObj = this.errorData.filter(
                (item) => item.code == err.status
              );
              console.log(errorObj);
              if (errorObj?.length > 0) {
                Swal.fire({
                  icon: "error",
                  title: "Status Code : " + errorObj[0].code,
                  text: "Message : " + errorObj[0].message,
                  confirmButtonText: "OK",
                  confirmButtonColor: "#456EFE",
                });
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Status Code : " + this.errorData[8].code,
                  text: "Message : " + this.errorData[8].message,
                  confirmButtonText: "OK",
                  confirmButtonColor: "#456EFE",
                });
              }
            }
            return throwError(err);
          })
        );
      })
    );
  }
}
