import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChequeBookRoutingModule } from "./cheque-book-routing.module";
import { ChequeComponent } from "./cheque/cheque.component";
import { ChequeStatusEnquiryComponent } from "./cheque-status-enquiry/cheque-status-enquiry.component";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { StopChequeComponent } from "./stop-cheque/stop-cheque.component";
import { ChequebookRequestComponent } from "./chequebook-request/chequebook-request.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";

@NgModule({
  declarations: [
    ChequeStatusEnquiryComponent,
    StopChequeComponent,
    ChequeComponent,
    ChequebookRequestComponent,
  ],
  imports: [
    CommonModule,
    ChequeBookRoutingModule,
    SharedMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SharedComponentsModule,
  ],
})
export class ChequeBookModule {}
