import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OfferLetterComponent } from "./offer-letter/offer-letter/offer-letter.component";
import { ProcessOfferLetterComponent } from "./offer-letter/process-offer-letter/process-offer-letter.component";
import { OtpComponent } from "./otp/otp.component";

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
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OriginationExternalCallbackRoutingModule {}
