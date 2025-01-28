import { SigninTrackComponent } from './signin-track/signin-track.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { RouterModule } from '@angular/router';
import { TrackingComponent } from './tracking.component';
import { TrackingRoute } from './tracking.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { TrackingSummaryComponent } from './tracking-summary/tracking-summary.component';
import { ProductListCardComponent } from './components/product-list-card/product-list-card.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { DynamicProductDetailsComponent } from './components/dynamic-product-details/dynamic-product-details.component';
import { ApplicationStatusComponent } from './components/application-status/application-status.component';
import { ScheduleKycVideoComponent } from './components/schedule-kyc-video/schedule-kyc-video.component';
import { IcustLibraryModule } from '@onerumango/icust-element-library';

@NgModule({
  declarations: [
    TrackingComponent,
    SigninTrackComponent,
    TrackingSummaryComponent,
    ProductListCardComponent,
    ProductDetailsComponent,
    DynamicProductDetailsComponent,
    ApplicationStatusComponent,
    ScheduleKycVideoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SharedMaterialModule,
    SharedComponentsModule,
    FlexLayoutModule,
    NgOtpInputModule,
    IcustLibraryModule,
    RouterModule.forChild(TrackingRoute),
  ],
})
export class TrackingModule {}
