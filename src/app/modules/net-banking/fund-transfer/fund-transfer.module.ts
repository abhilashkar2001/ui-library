import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FundTransferRoutingModule } from "./fund-transfer-routing.module";
import { FundTransferComponent } from "./fund-transfer/fund-transfer.component";
import { SingleFundTransferComponent } from "./single-fund-transfer/single-fund-transfer.component";
import { MultiFundTransferComponent } from "./multi-fund-transfer/multi-fund-transfer.component";
import { CreditCardPaymentComponent } from "./credit-card-payment/credit-card-payment.component";
import { SharedModule } from "app/shared/shared.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    FundTransferComponent,
    SingleFundTransferComponent,
    MultiFundTransferComponent,
    CreditCardPaymentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedComponentsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FundTransferRoutingModule,
  ],
})
export class FundTransferModule {}
