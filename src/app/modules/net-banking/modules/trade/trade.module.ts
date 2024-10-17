import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TradeRoutingModule } from "./trade-routing.module";
import { TradeDashboardComponent } from "./trade-dashboard/trade-dashboard.component";
import { CustomDrawerComponent } from "./custom-drawer/custom-drawer.component";
import { TradeFlowComponent } from "./trade-flow/trade-flow.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedMaterialModule } from "app/shared/shared-material.module";

@NgModule({
  declarations: [
    TradeDashboardComponent,
    CustomDrawerComponent,
    TradeFlowComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedMaterialModule,
    TradeRoutingModule,
  ],
})
export class TradeModule {}
