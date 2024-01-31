import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OfferLetterComponent } from "./offer-letter/offer-letter/offer-letter.component";
import { ProcessOfferLetterComponent } from "./offer-letter/process-offer-letter/process-offer-letter.component";
import { OtpComponent } from "./otp/otp.component";
import { SignLaterComponent } from "./digital-sign/sign-later/sign-later.component";
import { DocumentUploadComponent } from "./document-upload/document-upload.component";
import { RemarkComponent } from "./offer-letter/remark/remark.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "offer-letter",
    pathMatch: "full",
  },
  {
    path: "offer-letter",
    component: OfferLetterComponent,
    data: {
      title: "Offer Letter",
    },
  },
  {
    path: "process-offer",
    component: ProcessOfferLetterComponent,
    data: {
      title: "Offer Letter",
    },
  },
  {
    path: "otp",
    component: OtpComponent,
    data: {
      title: "OTP",
    },
  },
  {
    path: "remark",
    component: RemarkComponent,
    data: {
      title: "Remark",
    },
  },
  {
    path: "digital-sign",
    component: SignLaterComponent,
    data: {
      title: "Digital Sign",
    },
  },
  {
    path: "document-upload",
    component: DocumentUploadComponent,
    data: {
      title: "Document Upload",
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OriginationExternalCallbackRoutingModule {}
