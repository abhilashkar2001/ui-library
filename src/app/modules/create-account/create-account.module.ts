import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAccountComponent } from './create-account/create-account.component';
import { RouterModule } from '@angular/router';
import { HomeRoutes } from './create-account-routing';
import { LandingPageComponent } from './create-account/landing-page/landing-page.component';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateAccountLandingPageComponent } from './create-account/create-account-landing-page/create-account-landing-page.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { AccountTypeDetailsComponent } from './create-account/account-type-details/account-type-details.component';
import { ApplyAccountComponent } from './create-account/apply-account/apply-account.component';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@NgModule({
  declarations: [
    CreateAccountComponent,
    LandingPageComponent,
    CreateAccountLandingPageComponent,
    AccountTypeDetailsComponent,
    ApplyAccountComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedMaterialModule,
    SharedModule,
    HttpClientModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    RouterModule.forChild(HomeRoutes),
  ],
})
export class CreateAccountModule {}
