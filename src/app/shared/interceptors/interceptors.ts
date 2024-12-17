import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './token.interceptor';
import { ErrorNotifierService } from './error-notifier.interceptor';
import { LoaderInterceptor } from './loader.interceptor';
import { CachingInterceptor } from './browser-caching.interceptor';

export const InterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorNotifierService, multi: true },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CachingInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true,
  },
];
