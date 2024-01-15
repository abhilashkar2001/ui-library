import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OriginationExternalCallbackRoutingModule } from "./origination-external-callback-routing.module";
import { OtpComponent } from "./otp/otp.component";
import { OfferLetterComponent } from "./offer-letter/offer-letter/offer-letter.component";
import { ProcessOfferLetterComponent } from "./offer-letter/process-offer-letter/process-offer-letter.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { NgOtpInputModule } from "ng-otp-input";
import { SignLaterComponent } from './sign-later/sign-later.component';

@NgModule({
  declarations: [
    OtpComponent,
    OfferLetterComponent,
    ProcessOfferLetterComponent,
    SignLaterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    SharedMaterialModule,
    NgOtpInputModule,
    OriginationExternalCallbackRoutingModule,
  ],
})
export class OriginationExternalCallbackModule {}
