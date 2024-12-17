import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { TokenStorageService } from '../token-storage.service';

const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    const token = this.token.getToken();
    // language should be handle dynamically.
    const language = 'English';

    if (req.headers.get('Anonymous') == 'NOTKN') {
      const newHeaders = req.headers.delete('Anonymous');
      newHeaders.delete('Authorization');
      const newRequest = req.clone({ headers: newHeaders });
      return next.handle(newRequest);
    } else {
      if (token != null) {
        // for Spring Boot back-end
        authReq = req.clone({
          headers: req.headers
            .set(TOKEN_HEADER_KEY, 'Bearer ' + token)
            .set('language', language),
        });
      }
      return next.handle(authReq);
    }
  }
}
