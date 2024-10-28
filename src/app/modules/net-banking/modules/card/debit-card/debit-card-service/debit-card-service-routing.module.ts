import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PaymentPageComponent } from "../../../dashboard/modules/cheque-book/payment-page/payment-page.component";
import { BlockCardComponent } from "../../shared-card/components/block-card/block-card.component";
import { PinGenerationComponent } from "../../shared-card/components/pin-generation/pin-generation.component";
import { UpgradeComponent } from "../../shared-card/components/upgrade/upgrade.component";
import { DebitCardServiceComponent } from "./debit-card-service/debit-card-service.component";

const routes: Routes = [
  {
    path: "",
    component: DebitCardServiceComponent,
    children: [
      {
        path: "",
        redirectTo: "block-card",
        pathMatch: "full",
      },
      {
        path: "block-card",
        component: BlockCardComponent,
      },

      {
        path: "pin-generation",
        component: PinGenerationComponent,
      },

      {
        path: "upgrade",
        component: UpgradeComponent,
      },
    ],
  },
  {
    path: "payment-summary",
    component: PaymentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebitCardServiceRoutingModule {}
