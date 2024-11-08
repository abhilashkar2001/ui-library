import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { of, throwError } from "rxjs";
import { NewErrorPopupComponent } from "app/modules/home/new-error-popup/new-error-popup.component";
import { Route, Router } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { MatDialog } from "@angular/material/dialog";

@Injectable()
export class ErrorNotifierService implements HttpInterceptor {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService
  ) {}

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

        let errorPayload = {
          error: error?.error?.error,
          message: error?.error?.message,
          statusCode: error?.status,
        };

        return next.handle(request).pipe(
          catchError((err) => {
            // CLose all dialog popup on error
            this.dialog.closeAll();

            if (request.url.includes("assets/")) {
              return;
            } else if (error.status === 500) {
              this.openCustomErrorDialog(errorPayload);
              return throwError(error);
            } else if (request.url.includes("assets/")) {
              return;
            } else if (error.status === 403) {
              errorPayload.error = "Contact your Administrator.";
              errorPayload.message =
                "You do not have sufficient privileges to do this operation";
              this.openCustomErrorDialog(errorPayload);
              return;
            } else if (error.status === 401) {
              sessionStorage.clear();
              this.dialog.closeAll();
              this.router.navigate(["/home"], {
                queryParams: { type: "auth" },
              });
            } else {
              this.openCustomErrorDialog(errorPayload);
            }

            return throwError(err);
          })
        );
      })
    );
  }

  openCustomErrorDialog(errPayload?) {
    const dialogRef = this.dialog.open(NewErrorPopupComponent, {
      width: "45%",
      // height: "40%",
      disableClose: true,
      panelClass: "new_error_popup",
      data: {
        type: "customError",
        errPayload,
      },
    });
  }
}
