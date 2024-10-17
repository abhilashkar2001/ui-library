import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FundTransferRoutingModule } from "./fund-transfer-routing.module";
import { SingleFundTransferComponent } from "./single-fund-transfer/single-fund-transfer.component";
import { MultiFundTransferComponent } from "./multi-fund-transfer/multi-fund-transfer.component";
import { CreditCardPaymentComponent } from "./credit-card-payment/credit-card-payment.component";
import { SharedModule } from "app/shared/shared.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FundTransferSummaryComponent } from "./fund-transfer-summary/fund-transfer-summary.component";
import { TranslateModule } from "@ngx-translate/core";
import { AddBulkUploadComponent } from "./add-bulk-upload/add-bulk-upload.component";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { PendingForApprovalComponent } from "./pending-for-approval/pending-for-approval.component";

@NgModule({
  declarations: [
    SingleFundTransferComponent,
    MultiFundTransferComponent,
    CreditCardPaymentComponent,
    FundTransferSummaryComponent,
    AddBulkUploadComponent,
    BulkUploadComponent,
    PendingForApprovalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedComponentsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FundTransferRoutingModule,
    FormsModule,
    TranslateModule,
  ],
})
export class FundTransferModule {}
