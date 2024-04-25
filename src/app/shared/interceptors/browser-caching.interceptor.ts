import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable } from "rxjs";
import { startWith, tap } from "rxjs/operators";
import { InterceptorConstant } from "../models/maintApiInterceptor.constant";
import { RequestCache } from "../services/request-cache.service";

const cacheableEndpoints = InterceptorConstant.MAINTENANCE_CONSTANT;

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // continue if not cacheable.
    if (!isCacheable(req)) {
      return next.handle(req);
    }
    const cachedResponse = this.cache.get(req);

    // cache-then-refresh
    if (req.headers.get("x-refresh")) {
      const results$ = sendRequest(req, next, this.cache);
      return cachedResponse
        ? results$.pipe(startWith(cachedResponse))
        : results$;
    }

    // cache-or-fetch
    return cachedResponse
      ? of(cachedResponse)
      : sendRequest(req, next, this.cache);
  }
}

function isCacheable(req: HttpRequest<any>): boolean {
  // Implement your own logic to determine if the request is cacheable.
  // For example, you might check if the request method is GET.
  return req.method === "GET";
}

/**
 * Get server response observable by sending request to `next()`.
 * Will add the response to the cache on the way out.
 */
function sendRequest(
  req: HttpRequest<any>,
  next: HttpHandler,
  cache: RequestCache
): Observable<HttpEvent<any>> {
  return next.handle(req).pipe(
    tap((event) => {
      // There may be other events besides the response.
      if (event instanceof HttpResponse) {
        if (
          cacheableEndpoints.some((endPoint) =>
            req.urlWithParams.includes(endPoint?.endPoint)
          )
        )
          cache.put(req, event); // Update the cache.
      }
    })
  );
}
