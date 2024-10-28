import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PrepaidServicesComponent } from "./prepaid-services/prepaid-services.component";
import { PrepaidReloadComponent } from "./components/prepaid-reload/prepaid-reload.component";
import { PrepaidRefundComponent } from "./components/prepaid-refund/prepaid-refund.component";
import { BlockCardComponent } from "../../shared-card/components/block-card/block-card.component";
import { PinGenerationComponent } from "../../shared-card/components/pin-generation/pin-generation.component";

const routes: Routes = [
  {
    path: "",
    component: PrepaidServicesComponent,
    children: [
      {
        path: "",
        redirectTo: "reload",
        pathMatch: "full",
      },
      {
        path: "reload",
        component: PrepaidReloadComponent,
      },
      {
        path: "pin-generation",
        component: PinGenerationComponent,
      },
      {
        path: "block-card",
        component: BlockCardComponent,
      },
      {
        path: "refund",
        component: PrepaidRefundComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepaidCardServicesRoutingModule {}
