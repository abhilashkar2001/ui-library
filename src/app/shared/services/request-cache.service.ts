import { Injectable } from "@angular/core";
import { HttpRequest, HttpResponse } from "@angular/common/http";
// import { Subject, timer } from "rxjs";
// import { takeUntil } from "rxjs/operators";

// interface CustomHttpResponse<T> extends HttpResponse<T> {
//   expiryTime: number;
// }

@Injectable({
  providedIn: "root"
})
export class RequestCache {
  private cache$ = new Map<string, HttpResponse<any>>();
  // private cacheCleanup$ = new Subject<void>();

  constructor() {}

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const cachedResponse = this.cache$.get(req.urlWithParams);
    return cachedResponse ? cachedResponse : undefined;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    if (response.body?.statusCode === 200) {
      // const cacheTime: number = 3 * 60 * 1000;
      // const expiryTime = Date.now() + cacheTime;
      // response.body.expiryTime = expiryTime;
      this.cache$.set(req.urlWithParams, response);

      // Schedule cache entry removal after expiration time

      // timer(cacheTime)
      //   .pipe(takeUntil(this.cacheCleanup$))
      //   .subscribe(() => {
      //     this.cache.delete(req.urlWithParams);
      //   });
    }
  }

  clear(): void {
    this.cache$.clear();
  }

  // private startCacheCleanup(): void {
  //   // Cleanup cache every 1 minute
  //   timer(0, 1 * 60 * 1000)
  //     .pipe(takeUntil(this.cacheCleanup$))
  //     .subscribe(() => {
  //       this.cleanupExpiredEntries();
  //     });
  // }

  // private cleanupExpiredEntries(): void {
  //   const now = Date.now();
  //   for (const [key, entry] of this.cache$.entries()) {
  //     if (entry.body.data.expiryTime < now) {
  //       this.cache$.delete(key);
  //     }
  //   }
  // }
}
