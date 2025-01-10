import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from './shared/components/perfect-scrollbar';

import { rootRouterConfig } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { LayoutsModule } from './layouts/layouts.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InterceptorProviders } from './shared/interceptors/interceptors';
import { SwiperModule } from 'swiper/angular';
import { ToastrModule } from 'ngx-toastr';
import { CustomDateAdapter } from './shared/services/date-time/customDateAdapter';
import { DateAdapter } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { UserProfileInfoEffects } from './shared/store/effects/user-profileInfo.effects';
import { StoreModule } from '@ngrx/store';
import { AppState } from './shared/store/state/app.state';
import { UserProfileInfoReducer } from './shared/store/reducer/user-profileInfo.reducer';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutsModule,
    SharedModule,
    HttpClientModule,
    SwiperModule,
    PerfectScrollbarModule,
    StoreModule.forRoot<AppState>({
      userProfile: UserProfileInfoReducer,
    }),
    EffectsModule.forRoot([UserProfileInfoEffects]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RouterModule.forRoot(rootRouterConfig, {
      useHash: true,
    }),
    NgbModule,
    MatDialogModule,
    ToastrModule.forRoot({
      progressAnimation: 'decreasing',
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true,
    }),
  ],
  declarations: [AppComponent],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    // { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    // REQUIRED IF YOU USE JWT AUTHENTICATION
    InterceptorProviders,
    CustomDateAdapter,
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
