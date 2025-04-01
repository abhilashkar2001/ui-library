import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OriginationExternalCallbackRoutingModule } from './origination-external-callback-routing.module';
import { OtpComponent } from './otp/otp.component';
import { OfferLetterComponent } from './offer-letter/offer-letter/offer-letter.component';
import { ProcessOfferLetterComponent } from './offer-letter/process-offer-letter/process-offer-letter.component';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { SignLaterComponent } from './digital-sign/sign-later/sign-later.component';
import { SignNowPopupComponent } from './digital-sign/sign-now-popup/sign-now-popup.component';
import { SignPadComponent } from './digital-sign/sign-pad/sign-pad.component';
import { SuccessModalComponent } from './digital-sign/success-modal/success-modal.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { RemarkComponent } from './offer-letter/remark/remark.component';
import { ChecklistDocumentComponent } from './checklist-document/checklist-document.component';
import { DobVerificationComponent } from './dob-verification/dob-verification.component';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { SharedOriginationModule } from '../shared-origination/shared-origination.module';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { TranslateModule } from '@ngx-translate/core';
import { DigitalSignatureComponent } from './offer-letter/digital-signature/digital-signature.component';
import { SignSummaryComponent } from './offer-letter/sign-summary/sign-summary.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LibPipesModule } from '@onerumango/utils';

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
    RemarkComponent,
    ChecklistDocumentComponent,
    DobVerificationComponent,
    DigitalSignatureComponent,
    SignSummaryComponent,
  ],
  imports: [
    CommonModule,
    IcustLibraryModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    SharedMaterialModule,
    SharedComponentsModule,
    NgOtpInputModule,
    OriginationExternalCallbackRoutingModule,
    SharedPipesModule,
    SharedOriginationModule,
    MatProgressBarModule,
    LibPipesModule,
  ],
})
export class OriginationExternalCallbackModule {}
