import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BankGuaranteeRoutingModule } from "./bank-guarantee-routing.module";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from "@ngx-translate/core";
import { SharedTradeModule } from "../shared-trade/shared-trade.module";
import { AmendementInfoComponent } from "./pages/amendement-info/amendement-info.component";
import { BgInfoComponent } from "./pages/bg-info/bg-info.component";
import { BgAmendBgInfoComponent } from "./components/bg-amend-bg-info/bg-amend-bg-info.component";
import { BgIssuanceBgInfoComponent } from "./components/bg-issuance-bg-info/bg-issuance-bg-info.component";
import { TransactionInfoComponent } from "./components/transaction-info/transaction-info.component";

@NgModule({
  declarations: [
    AmendementInfoComponent,
    BgInfoComponent,
    BgAmendBgInfoComponent,
    BgIssuanceBgInfoComponent,
    TransactionInfoComponent,
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedMaterialModule,
    SharedTradeModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslateModule,
    BankGuaranteeRoutingModule,
  ],
})
export class BankGuaranteeModule {}
