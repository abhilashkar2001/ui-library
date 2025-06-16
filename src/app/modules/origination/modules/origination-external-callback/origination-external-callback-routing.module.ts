import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OfferLetterComponent } from './offer-letter/offer-letter/offer-letter.component';
import { ProcessOfferLetterComponent } from './offer-letter/process-offer-letter/process-offer-letter.component';
import { SignLaterComponent } from './digital-sign/sign-later/sign-later.component';
import { RemarkComponent } from './offer-letter/remark/remark.component';
import { DobVerificationComponent } from './dob-verification/dob-verification.component';
import { ChecklistDocumentComponent } from './checklist-document/checklist-document.component';
import {
  DigitalSignatureComponent,
} from 'app/modules/origination/modules/origination-external-callback/offer-letter/digital-signature/digital-signature.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'offer-letter',
    pathMatch: 'full',
  },
  {
    path: 'offer-letter',
    component: OfferLetterComponent,
    data: {
      title: 'Offer Letter',
    },
  },
  {
    path: 'process-offer',
    component: ProcessOfferLetterComponent,
    data: {
      title: 'Offer Letter',
    },
  },
  {
    path: 'remark',
    component: RemarkComponent,
    data: {
      title: 'Remark',
    },
  },
  {
    path: 'digital-sign',
    component: SignLaterComponent,
    data: {
      title: 'Digital Sign',
    },
  },
  {
    path: 'dob-verification',
    component: DobVerificationComponent,
    data: {
      title: 'Verification',
    },
  },
  {
    path: 'checklist-document',
    component: ChecklistDocumentComponent,
    data: {
      title: 'Verification',
    },
  },
  {
    path: 'digital-signature',
    component: DigitalSignatureComponent,
    data: {
      title: 'Digital Signature',
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OriginationExternalCallbackRoutingModule {}
