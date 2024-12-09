import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TradeRoutingModule } from "./trade-routing.module";
import { TradeDashboardComponent } from "./trade-dashboard/trade-dashboard.component";
import { TradeFlowComponent } from "./trade-flow/trade-flow.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";

@NgModule({
  declarations: [TradeDashboardComponent, TradeFlowComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedMaterialModule,
    SharedComponentsModule,
    TradeRoutingModule
  ]
})
export class TradeModule {}
