import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./token.interceptor";
import { ErrorNotifierService } from "./error-notifier.interceptor";

export const InterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorNotifierService, multi: true },
];
