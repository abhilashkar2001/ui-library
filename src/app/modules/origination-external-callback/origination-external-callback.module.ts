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
import { SignLaterComponent } from "./digital-sign/sign-later/sign-later.component";
import { SignNowPopupComponent } from "./digital-sign/sign-now-popup/sign-now-popup.component";
import { SignPadComponent } from "./digital-sign/sign-pad/sign-pad.component";
import { SuccessModalComponent } from "./digital-sign/success-modal/success-modal.component";
import { DocumentUploadComponent } from "./document-upload/document-upload.component";

@NgModule({
  declarations: [
    OtpComponent,
    OfferLetterComponent,
    ProcessOfferLetterComponent,
    SignLaterComponent,
    SignNowPopupComponent,
    SignPadComponent,
    SuccessModalComponent,
    DocumentUploadComponent,
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
