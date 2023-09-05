import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateAccountComponent } from "./create-account/create-account.component";
import { RouterModule } from "@angular/router";
import { HomeRoutes } from "./create-account-routing";
import { LandingPageComponent } from "./create-account/landing-page/landing-page.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AccountMobileVerificationComponent } from "./create-account/account-mobile-verification/account-mobile-verification.component";
import { AccountStepperComponent } from "./create-account/account-stepper/account-stepper.component";
import { CreateAccountPersonalDetailsComponent } from "./create-account/personal-details/personal-details.component";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateAccountLandingPageComponent } from "./create-account/create-account-landing-page/create-account-landing-page.component";
import { SharedModule } from "app/shared/shared.module";
import { NgOtpInputModule } from "ng-otp-input";
import { AccountTypeDetailsComponent } from "./create-account/account-type-details/account-type-details.component";
import { ApplyAccountComponent } from "./create-account/apply-account/apply-account.component";

@NgModule({
  declarations: [
    CreateAccountComponent,
    LandingPageComponent,
    AccountMobileVerificationComponent,
    CreateAccountPersonalDetailsComponent,
    AccountStepperComponent,
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
